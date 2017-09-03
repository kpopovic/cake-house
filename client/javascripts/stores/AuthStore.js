'use strict';

import Reflux from 'reflux';
import AuthActions from './../actions/auth-actions';
import axios from 'axios';

export default class AuthStore extends Reflux.Store {
    constructor(userAuthenticated) {
        super(userAuthenticated);
        this.listenables = AuthActions;
        this.state = { lStore: { userAuthenticated: userAuthenticated ? userAuthenticated : false } };
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
        const { username, password } = this.state.lStore;
        const basicAuth = "Basic " + btoa(field.username + ":" + field.password);

        const promise = axios.get(
            "/v1/user",
            { headers: { Authorization: basicAuth } }
        );

        promise.then(data => {
            const newData = Object.assign({}, this.state.lStore, { userAuthenticated: true });
            this.setState({ lStore: newData });
        }).catch(error => {
            console.log(error);
        });
    }

    onLogoutUser() {
        const promise = axios.get("/v1/user/logout");

        promise.then(data => {
            const newData = Object.assign({}, this.state.lStore, { userAuthenticated: false });
            this.setState({ lStore: newData });
        }).catch(error => {
            console.log(error);
        });
    }

}
