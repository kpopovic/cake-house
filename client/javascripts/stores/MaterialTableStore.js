'use strict';

import Reflux from 'reflux';
import MaterialTableActions from './../actions/material-table-actions';
import _ from 'lodash';
import axios from 'axios';

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
                    name: null,
                    isQuantityToBuy: false
                }
            }
        };
    }

    onListFirstPage(queryFilter) {
        const { limit, filter, isQuantityToBuy } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const thefilter = queryFilter ? queryFilter : filter;

        const rootUrl = `/v1/material?direction=first&limit=${aLimit}`;
        const url = this.urlFromParams(rootUrl, thefilter);
        const thePromise = axios.get(url);

        /*
        const thePromise = () => {
            if (thefilter.name && thefilter.name.length > 0) {
                const allNames = '%' + thefilter.name + '%';
                return axios.get(`/v1/material?direction=first&filter[name]=${allNames}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/material?direction=first&limit=${aLimit}`);
            }
        }*/

        thePromise.then(response => {
            if (response.data.code === 0) {
                const materials = response.data.data.materials;
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
                            list: _.sortBy(compactMaterials, [function (o) { return o.name.toUpperCase(); }]),
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
        }).catch(error => {
            console.log(error);
        });
    }

    onListNextPage() {
        const { limit, filter } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.maxLeftOff;
        const currentPage = this.state.mtStore.currentPage;
        const nextCurrentPage = currentPage + 1;

        const rootUrl = `/v1/material?direction=next&leftOff=${leftOff}&limit=${aLimit}`;
        const url = this.urlFromParams(rootUrl, thefilter);
        const thePromise = axios.get(url);

        /*
        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/material?direction=next&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/material?direction=next&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }*/

        thePromise.then(response => {
            if (response.data.code === 0) {
                const materials = response.data.data.materials;
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
                            list: _.sortBy(compactMaterials, [function (o) { return o.name.toUpperCase(); }]),
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
        }).catch(error => {
            console.log(error);
        });
    }

    onListPreviousPage() {
        const { limit, filter } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.minLeftOff;
        const currentPage = this.state.mtStore.currentPage;

        const rootUrl = `/v1/material?direction=next&leftOff=${leftOff}&limit=${aLimit}`;
        const url = this.urlFromParams(rootUrl, thefilter);
        const thePromise = axios.get(url);

        /*
        const thePromise = () => {
            if (filter.name && filter.name.length > 0) {
                const allNames = '%' + filter.name + '%';
                return axios.get(`/v1/material?direction=back&filter[name]=${allNames}&leftOff=${leftOff}&limit=${aLimit}`);
            } else {
                return axios.get(`/v1/material?direction=back&leftOff=${leftOff}&limit=${aLimit}`);
            }
        }*/

        thePromise.then(response => {
            if (response.data.code === 0) {
                const materials = response.data.data.materials;
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
                            list: _.sortBy(compactMaterials, [function (o) { return o.name.toUpperCase(); }]),
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
        }).catch(error => {
            console.log(error);
        });
    }

    urlFromParams(rootUrl, filter) {
        if (!filter || _.isEmpty(filter)) {
            return rootUrl;
        }

        if (filter.name && filter.name.length > 0) {
            const allNames = '%' + filter.name + '%';
            return rootUrl + `&filter[name]=${allNames}`;
        }

        if (filter.isQuantityToBuy) {
            return rootUrl + `&filter[isQuantityToBuy]=${filter.isQuantityToBuy}`;
        }

        return rootUrl;
    }

}

export function buildStore(limit) {
    return new MaterialTableStore(limit);
}
