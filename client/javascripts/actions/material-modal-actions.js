'use strict';

import Reflux from 'reflux';

const MaterialModalActions = Reflux.createActions([
    "saveOrUpdate",
    "showModalUpdateMaterial",
    "showModalAddMaterial",
    "closeModal",
    "setFormFieldName",
    "setFormFieldUnit",
    "setFormFieldQuantityInStock"
]);

export default MaterialModalActions;
