'use strict';

import Reflux from 'reflux';
import OrderInputActions from './../actions/order-input-actions';
import _ from 'lodash';
import moment from 'moment';

class OrderInputStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = OrderInputActions;
        this.state = defaultState;
    }

    onSetOrderName(name) {
        const isEmpty = _.isString(name) && _.trim(name).length === 0;
        const orderName = isEmpty ? '' : name;
        const state = Object.assign({}, this.state, { orderName: orderName });
        this.setState(state);
        OrderInputActions.stateChanged.completed(state);
    }

    onSetDeliveryDate(dateMoment) {
        const state = Object.assign({}, this.state, { deliveryDate: dateMoment });
        this.setState(state);
        OrderInputActions.stateChanged.completed(state);
    }

    onSetClientName(name) {
        const isEmpty = _.isString(name) && _.trim(name).length === 0;
        const clientName = isEmpty ? '' : name;
        const state = Object.assign({}, this.state, { clientName: clientName });
        this.setState(state);
        OrderInputActions.stateChanged.completed(state);
    }

    onSetClientPhone(phone) {
        const isEmpty = _.isString(phone) && _.trim(phone).length === 0;
        const clientPhone = isEmpty ? '' : phone;
        const state = Object.assign({}, this.state, { clientPhone: clientPhone });
        this.setState(state);
        OrderInputActions.stateChanged.completed(state);
    }
}

const defaultState = {
    orderName: '',
    clientName: '',
    clientPhone: '',
    deliveryDate: null,
};

export function buildStore() {
    return new OrderInputStore();
}
