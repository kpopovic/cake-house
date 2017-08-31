'use strict';

import Reflux from 'reflux';
import ProductTableActions from './../actions/product-table-actions';
import rootUrl from './../web-root-url';
const _ = require('lodash');

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

        const defaultUrl = rootUrl + `/v1/product?direction=first&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(thefilter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const products = response.data.products;
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
                            list: _.sortBy(compactProducts, ['name']),
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
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onListNextPage() {
        const { limit, filter } = this.state.mpStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mpStore.maxLeftOff;
        const currentPage = this.state.mpStore.currentPage;
        const nextCurrentPage = currentPage + 1;

        const defaultUrl = rootUrl + `/v1/product?direction=next&leftOff=${leftOff}&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(filter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const products = response.data.products;
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
                            list: _.sortBy(compactProducts, ['name']),
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
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onListPreviousPage() {
        const { limit, filter } = this.state.mpStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mpStore.minLeftOff;
        const currentPage = this.state.mpStore.currentPage;

        const defaultUrl = `/v1/product?direction=back&leftOff=${leftOff}&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(filter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const products = response.data.products;
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
                            list: _.sortBy(compactProducts, ['name']),
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
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    urlWithQueryParams(filter, defaultUrl) {
        if (!filter || !filter.name) return defaultUrl;

        return defaultUrl + `&filter[name]=${filter.name}`;
    }
}

export function buildStore(limit) {
    return new ProductTableStore(limit);
}
