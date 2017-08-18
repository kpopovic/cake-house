'use strict';

import Reflux from 'reflux';
import MaterialTableActions from './../actions/material-table-actions';
import rootUrl from './../web-root-url'

export default class MaterialTableStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = MaterialTableActions;
        this.state = { mtStore: { materials: [] } };
    }

    onListMaterials(request) {
        /*
        if (request.hasOwnProperty('start')) {
            //this.setState({ username: request.username });
        }

        if (request.hasOwnProperty('limit')) {
            //this.setState({ password: request.password });
        }*/

        const promise = $.ajax({
            url: rootUrl + "/v1/material",
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(data => {
            if (data.code === 0) {
                const newState = Object.assign({}, this.state.mtStore, { materials: data.data.materials });
                this.setState({ mtStore: newState });
            }
        });

        promise.fail(error => {
            console.error(error);
        });
    }
}