'use strict';

import Reflux from 'reflux';
import ProductModalActions from './../actions/product-modal-actions';
import rootUrl from './../web-root-url';
import _ from 'lodash';

class ProductModalStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = ProductModalActions;
        this.state = { store: defaultState };
    }

    onShowModal(product) {
        const data = _.cloneDeep(defaultState);
        data.currentProduct = product;
        data.open = true;
        this.setLocalState(data);
    }

    onSearchMaterial(name) {
        if (name.trim().length === 0) {
            this.resetFilter();
            return 0;
        }

        const { limit } = this.state.store.filter;
        const url = rootUrl + `/v1/material?direction=first&limit=${limit}&filter[name]=${name}`;

        this.searchInProgressOn();

        const promise = $.ajax({
            url: url,
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(response => {
            if (response.code === 0) {
                const data = _.cloneDeep(this.state.store);
                data.filter.searchedMaterials = response.data.materials;
                data.filter.name = name;
                data.filter.isSearchInProgress = false;
                this.setLocalState(data);
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onSelectMaterial(id) {
        if (Number.isInteger(id)) {
            const materials = _.filter(this.state.store.filter.searchedMaterials, { id: id });
            const data = _.cloneDeep(this.state.store);
            data.filter.selectedMaterial = materials[0];
            data.filter.name = materials[0].name;
            data.filter.isSearchInProgress = false;
            this.setLocalState(data);
        } else {
            console.warn(`Selected material id=${id} is not a number type`);
        }
    }

    onResetStore() {
        this.setLocalState(defaultState);
    }

    resetFilter() {
        const data = _.cloneDeep(this.state.store);
        data.filter = defaultState.filter;
        this.setLocalState(data);
    }

    searchInProgressOn() {
        const data = _.cloneDeep(this.state.store);
        data.filter.isSearchInProgress = false;
        this.setLocalState(data);
    }

    onSetMaterialQuantity(quantity) {
        const data = _.cloneDeep(this.state.store);
        const value = parseFloat(quantity);

        if (_.isNumber(value) && _.isFinite(value)) {
            data.filter.materialQuantity = value;
        } else {
            data.filter.materialQuantity = '';
        }

        this.setLocalState(data);
    }

    setLocalState(data) {
        const newData = _.cloneDeep(data);
        this.setState({ store: newData });
    }
}

const defaultState = {
    filter: {
        name: '',
        searchedMaterials: [],
        selectedMaterial: null,
        materialQuantity: '',
        isSearchInProgress: false,
        limit: 10
    },
    currentProduct: null,
    open: false
};

export function buildStore() {
    return new ProductModalStore();
}
