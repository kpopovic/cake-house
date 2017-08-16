'use strict';

import Reflux from 'reflux';
import AuthActions from './../actions/auth-actions';
import rootUrl from './../web-root-url'
import _ from 'lodash';

export default class AuthStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AuthActions;
        this.state = { lStore: { userAuthenticated: false } };
    }

    onSetFormFieldUsername(username) {
        const data = Object.assign({}, this.state.lStore, { username: username });
        this.setState({ lStore: data });
    }

    onSetFormFieldPassword(password) {
        const data = Object.assign({}, this.state.lStore, { password: password });
        this.setState({ lStore: data });
    }

    onLoginUser() {
        const field = _.pick(this.state.lStore, ['username', 'password']);
        const promise = $.ajax({
            url: rootUrl + "/v1/user",
            type: 'GET',
            crossDomain: false,
            dataType: 'json',
            headers: {
                "Authorization": "Basic " + btoa(field.username + ":" + field.password)
            }
        });

        promise.done(data => {
            const data = Object.assign({}, this.state.lStore, { userAuthenticated: true });
            this.setState({ lStore: data });
        });

        promise.fail(error => {
            console.error(error);
        });
    }

    onLogoutUser() {
        const promise = $.ajax({
            url: rootUrl + "/v1/user/logout",
            type: 'GET',
            crossDomain: false,
            dataType: 'json'
        });

        promise.done(data => {
            const data = Object.assign({}, this.state.lStore, { userAuthenticated: false });
            this.setState({ lStore: data });
        });

        promise.fail(error => {
            console.error(error);
        });
    }

}
