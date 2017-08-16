'use strict';

import Reflux from 'reflux';
import AuthActions from './../actions/auth-actions'
import rootUrl from './../web-root-url'

export default class IndexStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AuthActions;
        this.state = { activeItem: MENU_MATERIAL };
    }

    onUpdateCredentials(request) {
        if (request.hasOwnProperty('username')) {
            this.setState({ username: request.username });
        }

        if (request.hasOwnProperty('password')) {
            this.setState({ password: request.password });
        }
    }

    onLoginUser(request) {
        const promise = $.ajax({
            url: rootUrl + "/v1/user",
            type: 'GET',
            crossDomain: false,
            dataType: 'json',
            headers: {
                "Authorization": "Basic " + btoa(request.username + ":" + request.password)
            }
        });

        promise.done(data => {
            this.setState({ error: null, data: data });
        });

        promise.fail(error => {
            this.setState({ error: error, data: null });
        });
    }

}
