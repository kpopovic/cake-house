'use strict';

import Reflux from 'reflux';

const OrderSearchFilterActions = Reflux.createActions([
    "setName",
    "setState",
    "setFromDeliveryDate",
    "setToDeliveryDate"
]);

OrderSearchFilterActions.filter = Reflux.createAction({ asyncResult: true });

export default OrderSearchFilterActions;
