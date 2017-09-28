'use strict';

import Reflux from 'reflux';

let MaterialSearchFilterActions = Reflux.createActions([
    "setName",
    "setQuantityToBuy",
    "downloadShoppingList"
]);

MaterialSearchFilterActions.stateChanged = Reflux.createAction({ asyncResult: true });

export default MaterialSearchFilterActions;
