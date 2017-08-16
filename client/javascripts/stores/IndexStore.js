'use strict';

import Reflux from 'reflux';
import IndexActions from './../actions/index-actions'
import rootUrl from './../web-root-url'

export default class IndexStore extends Reflux.Store {
    constructor(item) {
        super(item);
        this.listenables = IndexActions;
        this.state = { iStore: { activeItem: item } };
    }

    onSetActiveItem(item) {
        this.setState({ iStore: { activeItem: item } });
    }

}
