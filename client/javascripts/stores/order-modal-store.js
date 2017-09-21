'use strict';

import Reflux from 'reflux';
import OrderModalActions from './../actions/order-modal-actions';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

class OrderModalStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = OrderModalActions;
        this.state = { store: defaultState };
    }

    onSave() {
        if (!this.state.store.isValid) {
            console.warn('Not all fields are set in store');
            return 0;
        }

        const { orderId, orderName, orderState, deliveryDate, clientName, clientPhone, products } = this.state.store;
        const thePromise = () => {
            const productQuantityList = products.map(m => {
                return { id: m.id, quantity: m.quantity }
            });

            const data = {
                name: _.trim(orderName),
                state: orderState,
                deliveryDate: deliveryDate.format('YYYY-MM-DD'),
                clientName: _.trim(clientName),
                clientPhone: _.trim(clientPhone),
                products: productQuantityList
            };

            if (orderId) {
                return axios.put(`/v1/order?orderId=${orderId}`, data);
            } else {
                return axios.post("/v1/order", data);
            }
        };

        thePromise().then(response => {
            if (response.data.code === 0) {
                OrderModalActions.save.completed();

            }
        }).catch(error => {
            console.log(error);
        });
    }

    onShowModal(order) {
        const orderId = _.get(order, 'id', null);
        const orderName = _.get(order, 'name', '');
        const tmpDeliveryDate = _.get(order, 'deliveryDate', null);
        const deliveryDate = tmpDeliveryDate ? moment(tmpDeliveryDate) : defaultState.deliveryDate;
        const initialState = _.get(order, 'state', defaultState.initialState);
        const clientName = _.get(order, 'clientName', '');
        const clientPhone = _.get(order, 'clientPhone', '');
        const products = _.get(order, 'products', []);
        const isLocked = initialState === 'done';
        const open = true;

        const data = {
            orderId: orderId,
            orderName: orderName,
            deliveryDate: deliveryDate,
            initialState: initialState,
            currentState: initialState,
            clientName: clientName,
            clientPhone: clientPhone,
            products: products,
            isLocked: isLocked,
            open: open
        };

        const newData = Object.assign({}, data, { isValid: this.isValid(data) });
        this.setState({ store: newData });
    }

    onUpdate(data) {
        const tmpData = _.mergeWith(this.state.store, data);
        const newData = Object.assign({}, tmpData, { isValid: this.isValid(tmpData) });
        this.setState({ store: newData });
    }

    onResetStore() {
        console.log("onResetStore=" + JSON.stringify(defaultState, null, 2));
        this.setState({ store: defaultState });
    }

    isValid(data) {
        const { orderName, orderState, clientName, deliveryDate, products } = data;
        return orderState != 'done' && products.length > 0 && orderName.length > 0 && clientName.length > 0 && deliveryDate != null;
    }
}

const defaultState = {
    orderId: null,
    orderName: '',
    deliveryDate: null, // moment
    initialState: 'pending', // only filled by showModal (value from database)
    currentState: '', // dinamically changed via update method (changed by user on GUI)
    clientName: '',
    clientPhone: '',
    products: [],
    isValid: false,
    isLocked: false,
    open: false
};

export function buildStore() {
    return new OrderModalStore();
}
