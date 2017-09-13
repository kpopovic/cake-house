'use strict';

import Reflux from 'reflux';

const OrderModalActions = Reflux.createActions([
    "showModal",
    "searchProduct",
    "selectProduct",
    "addProduct",
    "removeProduct",
    "setProductQuantity",
    "setOrderName",
    "setOrderState",
    "resetStore"
]);

OrderModalActions.save = Reflux.createAction({ asyncResult: true });

export default OrderModalActions;
