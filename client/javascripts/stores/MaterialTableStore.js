'use strict';

import Reflux from 'reflux';
import MaterialTableActions from './../actions/material-table-actions';
import rootUrl from './../web-root-url';
const _ = require('lodash');

export default class MaterialTableStore extends Reflux.Store {
    constructor(props) {
        super(props);

        const { limit } = props;
        const theLimit = parseInt(limit) > 0 ? limit : 10;

        this.listenables = MaterialTableActions;
        this.state = { mtStore: { list: [], currentPage: 1, limit: theLimit } };
    }

    onListFirstPage() {
        const aLimit = this.state.mtStore.limit + 1 // +1 is to see if we have next page
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
                    const minLeftOff = _.minBy(materials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(materials, function (o) { return o.id }).id;
                    const hasNext = aLimit === size;
                    const hasPrevious = false;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: materials,
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

    onListLastPage() {
        const aLimit = this.state.mtStore.limit + 1 // +1 is to see if we have next page
        const promise = $.ajax({
            url: rootUrl + `/v1/material?direction=last&limit=${aLimit}`,
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const materials = response.data.materials;
                const size = materials.length;

                if (size > 0) {
                    const minLeftOff = _.minBy(materials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(materials, function (o) { return o.id }).id;
                    const hasNext = false;
                    const hasPrevious = aLimit === size;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: materials,
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: Number.MAX_SAFE_INTEGER,
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
                            currentPage: Number.MAX_SAFE_INTEGER,
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
        const aLimit = this.state.mtStore.limit + 1 // +1 is to see if we have next page
        const leftOff = this.state.mtStore.maxLeftOff;
        const currentPage = this.state.mtStore.currentPage;

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
                    const minLeftOff = _.minBy(materials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(materials, function (o) { return o.id }).id;
                    const hasNext = aLimit === size;
                    const hasPrevious = currentPage > 1;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: materials,
                            minLeftOff: minLeftOff,
                            maxLeftOff: maxLeftOff,
                            currentPage: currentPage + 1,
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
                            currentPage: currentPage + 1,
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
        const aLimit = this.state.mtStore.limit + 1 // +1 is to see if we have next page
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
                    const minLeftOff = _.minBy(materials, function (o) { return o.id }).id;
                    const maxLeftOff = _.maxBy(materials, function (o) { return o.id }).id;
                    const hasNext = true;
                    const hasPrevious = aLimit === size;

                    const newState = Object.assign(
                        {},
                        this.state.mtStore,
                        {
                            list: materials,
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

    /*onListMaterials(pStart, pLimit) {
        const start = pStart && Number.isInteger(pStart) ? pStart : 0;
        const limit = pLimit && Number.isInteger(pLimit) ? pLimit : 10;

        const promise = $.ajax({
            url: rootUrl + `/v1/material?start=${start}&limit=${limit}`,
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(data => {
            if (data.code === 0) {
                const newState = Object.assign({}, this.state.mtStore, { list: data.data.materials, hasNext: data.data.hasNext });
                this.setState({ mtStore: newState });
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }*/

}
