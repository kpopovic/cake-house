'use strict';

import Reflux from 'reflux';

const OrderModalActions = Reflux.createActions([
    "save",
    "setState",
    "setOrderName",
    "setClientName",
    "setClientPhone",
    "setOrderName",
    "setClientName",
    "setClientPhone",
    "setDeliveryDate",
    "selectProduct",
    "searchProduct",
    "removeProduct",
    "setProductQuantity",
    "showModal",
    "resetStore",
    "resetAddProduct"
]);

OrderModalActions.save = Reflux.createAction({ asyncResult: true });
OrderModalActions.addProduct = Reflux.createAction({ asyncResult: true });

export default OrderModalActions;
