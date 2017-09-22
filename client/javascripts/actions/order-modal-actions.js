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
    "addProduct",
    "removeProduct",
    "setProductQuantity",
    "showModal",
    "resetStore",
]);

OrderModalActions.save = Reflux.createAction({ asyncResult: true });

export default OrderModalActions;
