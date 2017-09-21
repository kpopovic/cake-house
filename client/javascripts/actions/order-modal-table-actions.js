'use strict';

import Reflux from 'reflux';

const OrderModalTableActions = Reflux.createActions([
    "addProduct",
    "removeProduct"
]);

OrderModalTableActions.stateChanged = Reflux.createAction({ asyncResult: true });

export default OrderModalTableActions;
