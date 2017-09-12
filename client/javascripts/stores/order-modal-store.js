'use strict';

import Reflux from 'reflux';
import OrderModalActions from './../actions/order-modal-actions';
import _ from 'lodash';
import axios from 'axios';

class OrderModalStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = OrderModalActions;
        this.state = { store: defaultState };
    }

    onSave() {
        const thePromise = () => {
            const { orderId, orderName, products } = this.state.store;

            const productQuantityList = materials.map(m => {
                return { id: m.id, quantity: m.quantity }
            });

            const data = { name: _.trim(productName), products: productQuantityList };

            if (orderId) {
                return axios.put(`/v1/order?orderId=${orderId}`, data);
            } else {
                return axios.post("/v1/order", data);
            }
        };

        thePromise().then(response => {
            if (response.data.code === 0) {
                this.onResetStore();
                OrderModalActions.save.completed();
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onAddProduct() {
        const { selectedProduct, productQuantity } = this.state.store.filter;

        if (selectedProduct && productQuantity > 0) {
            const data = this.state.store;
            const product = Object.assign({}, selectedProduct, { quantity: productQuantity });
            data.products = _.concat(data.products, product);
            data.filter = defaultState.filter;
            this.setLocalState(data);
        } else {
            console.warn("Product filter settings are not valid");
        }
    }

    onRemoveProduct(id) {
        const data = this.state.store;
        const filteredProducts = _.filter(data.products, m => {
            return m.id !== id;
        });

        data.products = filteredProducts;
        this.setLocalState(data);
    }

    onShowModal(order) {
        const data = _.cloneDeep(defaultState);
        data.orderId = _.get(order, 'id', null);
        data.orderName = _.get(order, 'name', '');
        data.products = _.get(order, 'products', []);
        data.open = true;
        this.setLocalState(data);
    }

    onSearchProduct(name) {
        if (name.trim().length === 0) {
            this.resetFilter();
            return 0;
        }

        const { limit } = this.state.store.filter;
        this.searchInProgressOn();

        const allNames = '%' + name + '%';
        const promise = axios.get(`/v1/product?direction=first&limit=${limit}&filter[name]=${allNames}`);

        promise.then(response => {
            if (response.data.code === 0) {
                const data = this.state.store;
                data.filter.searchedProducts = response.data.data.products;
                data.filter.productName = name;
                data.filter.isSearchInProgress = false;
                this.setLocalState(data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    onSelectProduct(id) {
        const products = _.filter(this.state.store.filter.searchedProducts, { id: id });
        console.log("searchedProducts=" + JSON.stringify(this.state.store.filter.searchedProducts, null, 2));
        console.log("products=" + JSON.stringify(products, null, 2));
        const data = this.state.store;
        data.filter.selectedProduct = products[0];
        data.filter.productName = products[0].name;
        data.filter.isSearchInProgress = false;
        this.setLocalState(data);
    }

    onResetStore() {
        this.setLocalState(defaultState);
    }

    resetFilter() {
        const data = this.state.store;
        data.filter = defaultState.filter;
        this.setLocalState(data);
    }

    searchInProgressOn() {
        const data = this.state.store;
        data.filter.isSearchInProgress = false;
        this.setLocalState(data);
    }

    onSetProductQuantity(quantity) {
        const data = this.state.store;
        const value = parseInt(quantity);
        const isValidNumber = _.isNumber(value) && _.isFinite(value);
        data.filter.productQuantity = isValidNumber ? value : '';
        this.setLocalState(data);
    }

    onSetOrderName(name) {
        const data = this.state.store;
        const isEmpty = _.isString(name) && _.trim(name).length === 0;
        data.orderName = isEmpty ? '' : name;
        this.setLocalState(data);
    }

    setLocalState(data) {
        const newData = _.cloneDeep(data);
        this.setState({ store: newData });
    }
}

const defaultState = {
    filter: {
        productName: '',
        searchedProducts: [],
        selectedProduct: null,
        deliveryDate: null,
        productQuantity: '',
        isSearchInProgress: false,
        limit: 10
    },
    orderId: null,
    orderName: '',
    products: [],
    open: false
};

export function buildStore() {
    return new OrderModalStore();
}
