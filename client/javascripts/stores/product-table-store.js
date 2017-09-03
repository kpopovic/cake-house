'use strict';

import Reflux from 'reflux';
import ProductTableActions from './../actions/product-table-actions';
import _ from 'lodash';
import axios from 'axios';

class ProductTableStore extends Reflux.Store {

    constructor(limit) {
        super();

        const theLimit = Number.isInteger(limit) ? limit : 10;
        this.listenables = ProductTableActions;
        this.state = {
            mpStore: {
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
        const { limit, filter } = this.state.mpStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const thefilter = queryFilter ? queryFilter : filter;

        const thePromise = () => {
            if (thefilter.name && thefilter.name.length > 0) {
                const allNames = '%' + thefilter.name + '%';
                return axios.get(`/v1/product?direction=first&filter[name]=${allNames}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/product?direction=first&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const products = response.data.data.products;
                const size = products.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = false;
                    const compactProducts = hasNext ? _.slice(products, 0, limit) : products;
                    const minLeftOff = _.minBy(compactProducts, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactProducts, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: _.sortBy(compactProducts, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: thefilter
                        });

                    this.setState({ mpStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: thefilter
                        });

                    this.setState({ mpStore: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onListNextPage() {
        const { limit, filter } = this.state.mpStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mpStore.maxLeftOff;
        const currentPage = this.state.mpStore.currentPage;
        const nextCurrentPage = currentPage + 1;

        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/product?direction=next&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/product?direction=next&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const products = response.data.data.products;
                const size = products.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = nextCurrentPage > 1;
                    const compactProducts = hasNext ? _.slice(products, 0, limit) : products;
                    const minLeftOff = _.minBy(compactProducts, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactProducts, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: _.sortBy(compactProducts, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: nextCurrentPage,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ mpStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: nextCurrentPage,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ mpStore: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onListPreviousPage() {
        const { limit, filter } = this.state.mpStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mpStore.minLeftOff;
        const currentPage = this.state.mpStore.currentPage;

        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/product?direction=back&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/product?direction=back&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                const products = response.data.data.products;
                const size = products.length;

                if (size > 0) {
                    const hasNext = true;
                    const hasPrevious = aLimit === size;
                    const compactProducts = hasPrevious ? _.slice(products, 0, limit) : products;
                    const minLeftOff = _.minBy(compactProducts, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactProducts, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: _.sortBy(compactProducts, [function (o) { return o.name.toUpperCase(); }]),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: currentPage - 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ mpStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mpStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: currentPage - 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ mpStore: newState });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function buildStore(limit) {
    return new ProductTableStore(limit);
}
