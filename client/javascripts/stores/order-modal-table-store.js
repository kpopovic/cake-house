'use strict';

import Reflux from 'reflux';
import OrderModalTableActions from './../actions/order-modal-table-actions';
import _ from 'lodash';

class OrderModalTableStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = OrderModalTableActions;
        this.state = defaultState;
    }

    onAddProduct(product) {
        const products = _.concat(this.state.products, product);
        const state = { products: products };
        this.setState(state);
        OrderModalTableActions.stateChanged.completed(state);
    }

    onRemoveProduct(id) {
        const filteredProducts = _.filter(this.state, m => {
            return m.id !== id;
        });

        const state = { products: filteredProducts };
        this.setState(state);
        OrderModalTableActions.stateChanged.completed(state);
    }

    onResetStore() {
        this.setState(defaultState);
    }
}

const defaultState = {
    products: []
};

export function buildStore() {
    return new OrderModalTableStore();
}
