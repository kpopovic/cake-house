import Reflux from 'reflux';
import MaterialSearchFilterActions from './../actions/material-search-filter-actions';
import _ from 'lodash';

class MaterialSearchFilterStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = MaterialSearchFilterActions;
        this.state = { store: defaultState };
    }

    onSetName(name) {
        const theName = name && name.length > 0 ? name : '';
        const state = Object.assign({}, this.state.store, { name: theName });
        this.setLocaleState(state);
        MaterialSearchFilterActions.stateChanged.completed(state);
    }

    onSetQuantityToBuy(isQuantityToBuy) {
        const isToBuy = isQuantityToBuy === true;
        const state = Object.assign({}, this.state.store, { isQuantityToBuy: isToBuy });
        this.setLocaleState(state);
        MaterialSearchFilterActions.stateChanged.completed(state);
    }

    setLocaleState(data) {
        this.setState({ store: data });
    }
}

const defaultState = {
    name: '',
    isQuantityToBuy: false
};

export function buildStore() {
    return new MaterialSearchFilterStore();
}
