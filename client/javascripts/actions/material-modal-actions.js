'use strict';

import Reflux from 'reflux';

let MaterialModalActions = Reflux.createActions([
    "showModalUpdateMaterial",
    "showModalAddMaterial",
    "resetStore",
    "setFormFieldName",
    "setFormFieldUnit",
    "setFormFieldQuantityInStock"
]);

MaterialModalActions.saveOrUpdate = Reflux.createAction({ asyncResult: true });

export default MaterialModalActions;
