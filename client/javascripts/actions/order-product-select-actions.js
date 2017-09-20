'use strict';

import Reflux from 'reflux';

const OrderProductSelectActions = Reflux.createActions([
    "selectProduct",
    "searchProduct",
    "setProductQuantity",
    "addProduct"
]);

OrderProductSelectActions.stateChanged = Reflux.createAction({ asyncResult: true });

export default OrderProductSelectActions;
