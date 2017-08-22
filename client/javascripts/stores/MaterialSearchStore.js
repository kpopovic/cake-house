'use strict';

import Reflux from 'reflux';
import MaterialSearchFilterActions from './../actions/material-search-filter-actions';

class MaterialSearchStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = MaterialSearchFilterActions;
        this.state = { msfStore: { name: null, isToBuy: false } };
    }

    onSetFormFieldName(value) {
        const newState = Object.assign({}, this.state.msfStore, { name: value });
        this.setState(newState);
    }

    onSetFormFieldIsToBuy(value) {
        const newState = Object.assign({}, this.state.msfStore, { isToBuy: value });
        this.setState(newState);
    }
}

export function buildStore() {
    return new MaterialSearchStore();
}
