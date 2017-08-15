'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, Grid, Segment, Header, Message } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import rootUrl from './../javascripts/web-root-url.js'
import Reflux from 'reflux';
import AuthStore from './../javascripts/stores/AuthStore.js';
import AuthActions from './../javascripts/actions/auth-actions.js';

export default class LoginForm extends Reflux.Component {
    constructor() {
        super();
        this.store = AuthStore;
    }

    handleOnClick() {
        AuthActions.loginUser({
            username: this.state.username,
            password: this.state.password
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const data = this.state.data;
        if (data && data.code === 0) {
            window.location.replace(rootUrl + "/index");
        }
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        {locale.login_page_title}
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                onChange={(e, { value }) => AuthActions.updateCredentials({ username: value })}
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder={locale.login_page_username}
                            />
                            <Form.Input
                                onChange={(e, { value }) => AuthActions.updateCredentials({ password: value })}
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder={locale.login_page_password}
                                type='password'
                            />

                            <Button color='teal' fluid size='large' onClick={this.handleOnClick.bind(this)}>{locale.login_page_login}</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

ReactDOM.render(
    <LoginForm />,
    document.getElementById('content')
);
