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
        this.state = { store: this.copyOfDefaultState() };
    }

    onSave() {
        const { isOrderLocked, isOrderValid } = this.state.store;
        if (isOrderLocked || !isOrderValid) {
            console.warn('Not allowed to save data=' + JSON.stringify(this.state.store, null, 2));
            return 0;
        }

        const { orderId, orderName, currentState, deliveryDate, clientName, clientPhone, products } = this.state.store;
        const thePromise = () => {
            const productQuantityList = products.map(m => {
                return { id: m.id, quantity: m.quantity }
            });

            const data = {
                name: _.trim(orderName),
                state: currentState,
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
        const deliveryDate = tmpDeliveryDate ? moment(tmpDeliveryDate) : this.copyOfDefaultState().deliveryDate;
        const initialState = _.get(order, 'state', this.copyOfDefaultState().initialState);
        const clientName = _.get(order, 'clientName', '');
        const clientPhone = _.get(order, 'clientPhone', '');
        const products = _.get(order, 'products', []);
        const isOrderLocked = initialState === 'done';
        const open = true;

        const data = {
            productSelect: this.copyOfDefaultState().productSelect,
            orderId: orderId,
            orderName: orderName,
            deliveryDate: deliveryDate,
            initialState: initialState,
            currentState: initialState,
            clientName: clientName,
            clientPhone: clientPhone,
            products: products,
            isOrderLocked: isOrderLocked,
            isOrderValid: orderId != null,
            open: open
        };

        this.setLocalState(data);
    }

    onSetState(state) {
        const newState = Object.assign({}, this.state.store, { currentState: state });
        this.setLocalState(newState);
    }

    onSetOrderName(name) {
        const isEmpty = _.isString(name) && _.trim(name).length === 0;
        const orderName = isEmpty ? '' : name;
        const state = Object.assign({}, this.state.store, { orderName: orderName });
        this.setLocalState(state);
    }

    onSetDeliveryDate(dateMoment) {
        const state = Object.assign({}, this.state.store, { deliveryDate: dateMoment });
        this.setLocalState(state);
    }

    onSetClientName(name) {
        const isEmpty = _.isString(name) && _.trim(name).length === 0;
        const clientName = isEmpty ? '' : name;
        const state = Object.assign({}, this.state.store, { clientName: clientName });
        this.setLocalState(state);
    }

    onSetClientPhone(phone) {
        const isEmpty = _.isString(phone) && _.trim(phone).length === 0;
        const clientPhone = isEmpty ? '' : phone;
        const state = Object.assign({}, this.state.store, { clientPhone: clientPhone });
        this.setLocalState(state);
    }

    onAddProduct() {
        const { selected } = this.state.store.productSelect;
        const quantity = Number.parseInt(selected.quantity);
        if (quantity > 0) {
            const product = Object.assign({}, selected, { quantity: quantity });
            const data = Object.assign(
                {},
                this.state.store,
                { productSelect: this.copyOfDefaultState().productSelect },
                { products: _.concat(this.state.store.products, product) }
            );

            this.setLocalState(data);
            OrderModalActions.addProduct.completed(data);
        }
    }

    onSearchProduct(name) {
        if (name.trim().length === 0) {
            const state = Object.assign({}, this.state.store);
            state.productSelect.name = name;
            this.setLocalState(state);

            return 0;
        }

        const limit = 10;
        const allNames = '%' + name + '%';
        const promise = axios.get(`/v1/product?direction=first&limit=${limit}&filter[name]=${allNames}`);

        promise.then(response => {
            if (response.data.code === 0) {
                const state = Object.assign({}, this.state.store);
                state.productSelect.name = name;
                state.productSelect.searchResult = response.data.data.products;
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
            const products = _.filter(this.state.store.productSelect.searchResult, { id: value });
            const state = Object.assign({}, this.state.store);
            state.productSelect.name = products[0].name;
            state.productSelect.selected = products[0];
            this.setLocalState(state);
        } else {
            console.warn("Product id is not a number");
        }
    }

    onSetProductQuantity(quantity) {
        const value = parseInt(quantity);
        const isValidNumber = _.isNumber(value) && _.isFinite(value);
        const productQuantity = isValidNumber ? value : '';
        const state = Object.assign({}, this.state.store);
        state.productSelect.selected.quantity = productQuantity;
        this.setLocalState(state);
    }

    onRemoveProduct(id) {
        const filteredProducts = _.filter(this.state.store.products, m => {
            return m.id !== id;
        });

        const state = Object.assign({}, this.state.store, { products: filteredProducts });
        this.setLocalState(state);
    }

    onResetStore() {
        this.setLocalState(this.copyOfDefaultState());
    }

    onResetAddProduct() {
        const state = Object.assign({}, this.state.store, { productSelect: this.copyOfDefaultState().productSelect });
        this.setLocalState(state);
    }

    isOrderValid() {
        const { orderName, clientName, deliveryDate, products } = this.state.store;
        return products.length > 0 && orderName.length > 0 && clientName.length > 0 && deliveryDate != null;
    }

    setLocalState(state) {
        const theState = Object.assign({}, state, { isOrderValid: this.isOrderValid() });
        this.setState({ store: theState });
    }

    copyOfDefaultState() {
        return _.cloneDeep(defaultState);
    }
}

const defaultState = {
    productSelect: {
        name: '',
        searchResult: [],
        selected: null
    },
    orderId: null,
    orderName: '',
    deliveryDate: null, // moment
    initialState: 'pending', // only filled by showModal (value from database)
    currentState: '', // dinamically changed via update method (changed by user on GUI)
    clientName: '',
    clientPhone: '',
    products: [],
    isOrderLocked: false, // isOrderLocked=true when initialState = 'done'
    open: false
};

export function buildStore() {
    return new OrderModalStore();
}
