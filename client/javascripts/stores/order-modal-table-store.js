'use strict';

import Reflux from 'reflux';
import OrderModalTableActions from './../actions/order-modal-table-actions';
import _ from 'lodash';

class OrderModalTableStore extends Reflux.Store {

    constructor(products) {
        super(products);
        this.listenables = OrderModalTableActions;
        this.state = { products: products };
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
        this.setState({ products: [] });
    }
}

export function buildStore(products) {
    return new OrderModalTableStore(products);
}
