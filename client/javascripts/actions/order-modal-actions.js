'use strict';

import Reflux from 'reflux';

const OrderModalActions = Reflux.createActions([
    "showModal",
    "searchProduct",
    "selectProduct",
    "addProduct",
    "removeProduct",
    "setMaterialQuantity",
    "setOrderName",
    "resetStore"
]);

OrderModalActions.save = Reflux.createAction({ asyncResult: true });

export default OrderModalActions;
