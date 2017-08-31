'use strict';

import Reflux from 'reflux';

const ProductModalActions = Reflux.createActions([
    "showModal",
    "searchMaterial",
    "selectMaterial",
    "addMaterial",
    "setMaterialQuantity",
    "save",
    "resetStore"
]);

export default ProductModalActions;
