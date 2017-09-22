'use strict';

import Reflux from 'reflux';
import OrderProductSelectActions from './../actions/order-product-select-actions';
import OrderModalActions from './../actions/order-modal-actions';
import _ from 'lodash';
import axios from 'axios';

class OrderProductSelectStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = [OrderProductSelectActions, OrderModalActions];
        this.state = { store: defaultState };
    }

    onAddProduct() {
        const { selectedProduct, productQuantity } = this.state.store;
        if (selectedProduct && productQuantity > 0) {
            const product = Object.assign({}, selectedProduct, { quantity: productQuantity });
            this.onResetStore();
            OrderProductSelectActions.stateChanged.completed(product);
        } else {
            console.warn("Product filter settings are not valid");
        }
    }

    onSearchProduct(name) {
        if (name.trim().length === 0) {
            const state = Object.assign({}, this.state.store, { productName: '' });
            this.setLocalState(state);

            return 0;
        }

        const limit = 10;
        const allNames = '%' + name + '%';
        const promise = axios.get(`/v1/product?direction=first&limit=${limit}&filter[name]=${allNames}`);

        promise.then(response => {
            if (response.data.code === 0) {
                const state = Object.assign({}, this.state.store, { productName: name, searchResult: response.data.data.products });
                this.setLocalState(state);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onSelectProduct(id) {
        const value = parseInt(id);
        const isValidNumber = _.isNumber(value) && _.isFinite(value);
        if (isValidNumber) {
            const products = _.filter(this.state.searchResult, { id: value });
            const state = Object.assign({}, this.state.store, { productName: products[0].name, selectedProduct: products[0] });
            this.setLocalState(state);
        }
    }

    onSetProductQuantity(quantity) {
        const value = parseInt(quantity);
        const isValidNumber = _.isNumber(value) && _.isFinite(value);
        const productQuantity = isValidNumber ? value : '';
        const state = Object.assign({}, this.state.store, { productQuantity: productQuantity });
        this.setLocalState(state);
    }

    onResetStore() {
        this.setLocalState(defaultState);
    }

    setLocalState(data) {
        this.setState({ store: data });
    }
}

const defaultState = {
    productName: '',
    searchResult: [],
    selectedProduct: null,
    productQuantity: ''
};

export function buildStore() {
    return new OrderProductSelectStore();
}
