'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Menu, Segment, Icon } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import rootUrl from './../javascripts/web-root-url.js'
import Material from './../jsx/material/Material'
import ProductContainer from './../jsx/product/ProductContainer'
import OrderContainer from './../jsx/order/OrderContainer'

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: MENU_MATERIAL };
    }

    handleItemClick(event, item) {
        this.setState({ activeItem: item.name });
    }

    handleSignOutClick(event) {
        service.publish(constants.TOPIC_LOGOUT_REQUEST, {
            data: null
        });
    }

    logoutResponse(response) {
        if (response.data && response.data.code === 0) {
            window.location.replace(rootUrl + "/login");
        }
    }

    render() {
        const { activeItem } = this.state;

        return (
            <div>
                <Menu pointing>
                    <Menu.Item name={MENU_MATERIAL} active={activeItem === MENU_MATERIAL} onClick={this.handleItemClick.bind(this)}>
                        MENU_MATERIAL
                    </Menu.Item>
                    <Menu.Item name={MENU_PRODUCT} active={activeItem === MENU_PRODUCT} onClick={this.handleItemClick.bind(this)}>
                        MENU_PRODUCT
                    </Menu.Item>
                    <Menu.Item name={MENU_ORDER} active={activeItem === MENU_ORDER} onClick={this.handleItemClick.bind(this)}>
                        MENU_ORDER
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Icon className="sign out big" onClick={this.handleSignOutClick.bind(this)} />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <div style={activeItem === MENU_MATERIAL ? {} : { display: 'none' }}>
                    <Material />
                </div>

                <div style={activeItem === MENU_PRODUCT ? {} : { display: 'none' }}>
                    <ProductContainer />
                </div>

                <div style={activeItem === MENU_ORDER ? {} : { display: 'none' }}>
                    <OrderContainer />
                </div>
            </div>
        )
    }

}

const MENU_MATERIAL = 'material';
const MENU_PRODUCT = 'product';
const MENU_ORDER = 'order';

ReactDOM.render(
    <Index />,
    document.getElementById('content')
);
