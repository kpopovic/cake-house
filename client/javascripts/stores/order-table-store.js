'use strict';

import Reflux from 'reflux';
import OrderTableActions from './../actions/order-table-actions';
import _ from 'lodash';
import axios from 'axios';

class OrderTableStore extends Reflux.Store {

    constructor(limit) {
        super();

        const theLimit = Number.isInteger(limit) ? limit : 10;
        this.listenables = OrderTableActions;
        this.state = {
            store: {
                list: [],
                currentPage: 1,
                hasNext: false,
                hasPrevious: false,
                limit: theLimit,
                filter: {
                    name: null
                }
            }
        };
    }

    onListFirstPage(queryFilter) {
        const { limit, filter } = this.state.store;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const thefilter = queryFilter ? queryFilter : filter;

        const thePromise = () => {
            if (thefilter.name && thefilter.name.length > 0) {
                const allNames = '%' + thefilter.name + '%';
                return axios.get(`/v1/order?direction=first&filter[name]=${allNames}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/order?direction=first&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const orders = response.data.data.orders;
                const size = orders.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = false;
                    const compactOrders = hasNext ? _.slice(orders, 0, limit) : orders;
                    const minLeftOff = _.minBy(compactOrders, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactOrders, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: _.sortBy(compactOrders, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: thefilter
                        });

                    this.setState({ store: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: thefilter
                        });

                    this.setState({ store: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onListNextPage() {
        const { limit, filter } = this.state.store;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.store.maxLeftOff;
        const currentPage = this.state.store.currentPage;
        const nextCurrentPage = currentPage + 1;

        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/order?direction=next&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/order?direction=next&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const orders = response.data.data.orders;
                const size = orders.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = nextCurrentPage > 1;
                    const compactOrders = hasNext ? _.slice(orders, 0, limit) : orders;
                    const minLeftOff = _.minBy(compactOrders, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactOrders, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: _.sortBy(compactOrders, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: nextCurrentPage,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ store: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: nextCurrentPage,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ store: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onListPreviousPage() {
        const { limit, filter } = this.state.store;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.store.minLeftOff;
        const currentPage = this.state.store.currentPage;

        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/order?direction=back&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/order?direction=back&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const orders = response.data.data.orders;
                const size = orders.length;

                if (size > 0) {
                    const hasNext = true;
                    const hasPrevious = aLimit === size;
                    const compactOrders = hasNext ? _.slice(orders, 0, limit) : orders;
                    const minLeftOff = _.minBy(compactOrders, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactOrders, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: _.sortBy(compactOrders, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: currentPage - 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ store: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.store,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: currentPage - 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ store: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function buildStore(limit) {
    return new OrderTableStore(limit);
}
