'use strict';

import Reflux from 'reflux';

const ProductModalActions = Reflux.createActions([
    "showModal",
    "searchMaterial",
    "selectMaterial",
    "addMaterial",
    "removeMaterial",
    "setMaterialQuantity",
    "setProductName",
    "resetStore"
]);

ProductModalActions.save = Reflux.createAction({ asyncResult: true });

export default ProductModalActions;
