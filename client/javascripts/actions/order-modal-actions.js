'use strict';

import Reflux from 'reflux';

const OrderModalActions = Reflux.createActions([
    "save",
    "showModal",
    "update",
    "resetStore",
]);

OrderModalActions.save = Reflux.createAction({ asyncResult: true });

export default OrderModalActions;
