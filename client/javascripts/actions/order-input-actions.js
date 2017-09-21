'use strict';

import Reflux from 'reflux';

const OrderInputActions = Reflux.createActions([
    "setOrderName",
    "setClientName",
    "setClientPhone",
    "setDeliveryDate"
]);

OrderInputActions.stateChanged = Reflux.createAction({ asyncResult: true });

export default OrderInputActions;
