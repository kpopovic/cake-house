'use strict';

import MaterialTableStore from './../../javascripts/stores/MaterialTableStore';

let myStores = []; // store cache

function assignId(store, id) {
    if (myStores[id]) {
        console.log("cache=" + myStores[id]);
        return myStores[id];
    }

    store.id = id;
    myStores[id] = store;

    return myStores[id];
}

export function buildStore(id, props) {
    const splitted = id.split('-');
    const storeName = splitted[0];
    const theProps = props ? props : {};

    if (storeName === 'materialTableStore') {
        return assignId(new MaterialTableStore(theProps), id);
    } else if (storeName === 'productsTableStore') {
        return assignId(new MaterialTableStore(), id);
    } else if (storeName === 'ordersTableStore') {
        return assignId(new MaterialTableStore(), id);
    } else {
        throw `Unknow store name <${storeName}>`;
    }
}
