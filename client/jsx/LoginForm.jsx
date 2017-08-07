'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, Grid, Header, Input, Message, Segment } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import service from './../javascripts/services/login-service.js';
import constants from './../javascripts/constants.js'

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.subscription = service.subscribe(constants.TOPIC_LOGIN_RESPONSE, this.loginResponse.bind(this));
    }

    componentWillMount() {
        //document.body.classList.add('login');
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    handleOnChange(fieldName, event) {
        if (fieldName === 'username') {
            this.username = event.target.value;
        } if (fieldName === 'password') {
            this.password = event.target.value;
        }
    }

    handleOnClick() {
        service.publish(constants.TOPIC_LOGIN_REQUEST, {
            data: {
                username: this.username,
                password: this.password
            }
        });
    }

    loginResponse(response) {
        console.log(JSON.stringify(response, null, 2));
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
                                onChange={this.handleOnChange.bind(this, 'username')}
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder={locale.login_page_username}
                            />
                            <Form.Input
                                onChange={this.handleOnChange.bind(this, 'password')}
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
