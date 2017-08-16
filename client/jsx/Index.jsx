'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Menu, Segment, Icon } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import rootUrl from './../javascripts/web-root-url.js'
import AuthActions from './../javascripts/actions/auth-actions'
import IndexActions from './../javascripts/actions/index-actions'
import AuthStore from './../javascripts/stores/AuthStore'
import IndexStore from './../javascripts/stores/IndexStore'
import Material from './../jsx/material/Material'
import ProductContainer from './../jsx/product/ProductContainer'
import OrderContainer from './../jsx/order/OrderContainer'
import Reflux from 'reflux';

export default class Index extends Reflux.Component {
    constructor() {
        super();
        this.stores = [new AuthStore(true), new IndexStore(MENU_MATERIAL)];
    }

    componentDidUpdate() {
        const { userAuthenticated } = this.state.lStore;
        if (!userAuthenticated) {
            window.location.replace(rootUrl + "/login");
        }
    }

    render() {
        const { activeItem } = this.state.iStore;

        return (
            <div>
                <Menu pointing>
                    <Menu.Item name={MENU_MATERIAL} active={activeItem === MENU_MATERIAL} onClick={(e, data) => IndexActions.setActiveItem(MENU_MATERIAL)}>
                        MENU_MATERIAL
                    </Menu.Item>
                    <Menu.Item name={MENU_PRODUCT} active={activeItem === MENU_PRODUCT} onClick={(e, data) => IndexActions.setActiveItem(MENU_PRODUCT)}>
                        MENU_PRODUCT
                    </Menu.Item>
                    <Menu.Item name={MENU_ORDER} active={activeItem === MENU_ORDER} onClick={(e, data) => IndexActions.setActiveItem(MENU_ORDER)}>
                        MENU_ORDER
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Icon className="sign out big" onClick={(e, data) => AuthActions.logoutUser()} />
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
