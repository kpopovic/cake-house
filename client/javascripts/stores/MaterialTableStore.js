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
        this.state = { mtStore: { list: [], currentPage: 1, hasNext: false, hasPrevious: false, limit: theLimit } };
    }

    onListFirstPage() {
        const { limit } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const promise = $.ajax({
            url: rootUrl + `/v1/material?direction=first&limit=${aLimit}`,
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
                            hasPrevious: hasPrevious
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
                            hasPrevious: false
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
        const { limit } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.maxLeftOff;
        const currentPage = this.state.mtStore.currentPage;
        const nextCurrentPage = currentPage + 1;

        const promise = $.ajax({
            url: rootUrl + `/v1/material?direction=next&leftOff=${leftOff}&limit=${aLimit}`,
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
                            hasPrevious: hasPrevious
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
                            hasPrevious: false
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
        const { limit } = this.state.mtStore;
        const aLimit = limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.minLeftOff;
        const currentPage = this.state.mtStore.currentPage;

        const promise = $.ajax({
            url: rootUrl + `/v1/material?direction=back&leftOff=${leftOff}&limit=${aLimit}`,
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
                            hasPrevious: hasPrevious
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
                            hasPrevious: false
                        });

                    this.setState({ mtStore: newState });
                }
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }
}

export function buildStore(limit) {
    return new MaterialTableStore(limit);
}
