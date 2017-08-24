'use strict';

import Reflux from 'reflux';
import MaterialTableActions from './../actions/material-table-actions';
import rootUrl from './../web-root-url';
const _ = require('lodash');

class MaterialTableStore extends Reflux.Store {

    constructor(limit) {
        super();

        const theLimit = Number.isInteger(limit) ? limit : 10;
        this.listenables = MaterialTableActions;
        this.state = {
            mtStore: {
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
        const { limit, filter } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const thefilter = queryFilter ? queryFilter : filter;

        const defaultUrl = rootUrl + `/v1/material?direction=first&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(thefilter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const materials = response.data.materials;
                const size = materials.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = false;
                    const compactMaterials = hasNext ? _.slice(materials, 0, limit) : materials;
                    const minLeftOff = _.minBy(compactMaterials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactMaterials, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: _.sortBy(compactMaterials, ['name']),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: thefilter
                        });

                    this.setState({ mtStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: thefilter
                        });

                    this.setState({ mtStore: newState });
                }
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onListNextPage() {
        const { limit, filter } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.maxLeftOff;
        const currentPage = this.state.mtStore.currentPage;
        const nextCurrentPage = currentPage + 1;

        const defaultUrl = rootUrl + `/v1/material?direction=next&leftOff=${leftOff}&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(filter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const materials = response.data.materials;
                const size = materials.length;

                if (size > 0) {
                    const hasNext = aLimit === size;
                    const hasPrevious = nextCurrentPage > 1;
                    const compactMaterials = hasNext ? _.slice(materials, 0, limit) : materials;
                    const minLeftOff = _.minBy(compactMaterials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactMaterials, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: _.sortBy(compactMaterials, ['name']),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: nextCurrentPage,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ mtStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: nextCurrentPage,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ mtStore: newState });
                }
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onListPreviousPage() {
        const { limit, filter } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.minLeftOff;
        const currentPage = this.state.mtStore.currentPage;

        const defaultUrl = `/v1/material?direction=back&leftOff=${leftOff}&limit=${aLimit}`;
        const promise = $.ajax({
            url: this.urlWithQueryParams(filter, defaultUrl),
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const materials = response.data.materials;
                const size = materials.length;

                if (size > 0) {
                    const hasNext = true;
                    const hasPrevious = aLimit === size;
                    const compactMaterials = hasPrevious ? _.slice(materials, 0, limit) : materials;
                    const minLeftOff = _.minBy(compactMaterials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(compactMaterials, function (o) { return o.id }).id;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: _.sortBy(compactMaterials, ['name']),
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: currentPage - 1,
                            hasNext: hasNext,
                            hasPrevious: hasPrevious,
                            filter: filter
                        });

                    this.setState({ mtStore: newState });
                } else {
                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: [],
                            minLeftOff: null,
                            maxLeftOff: null,
                            currentPage: currentPage - 1,
                            hasNext: false,
                            hasPrevious: false,
                            filter: filter
                        });

                    this.setState({ mtStore: newState });
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
    return new MaterialTableStore(limit);
}
