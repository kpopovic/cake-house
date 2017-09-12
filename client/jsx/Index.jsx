'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Menu, Segment, Button } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import rootUrl from './../javascripts/web-root-url.js'
import AuthActions from './../javascripts/actions/auth-actions'
import IndexActions from './../javascripts/actions/index-actions'
import AuthStore from './../javascripts/stores/AuthStore'
import IndexStore from './../javascripts/stores/IndexStore'
import Material from './../jsx/material/Material'
import Product from './../jsx/product/Product'
import Order from './../jsx/order/Order'
import Reflux from 'reflux';
import hrLocale from 'moment/locale/hr';
import moment from 'moment';

export default class Index extends Reflux.Component {
    constructor() {
        super();
        moment.updateLocale('hr', hrLocale); // global settings
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
                        {locale.index_page_material_menu_title}
                    </Menu.Item>
                    <Menu.Item name={MENU_PRODUCT} active={activeItem === MENU_PRODUCT} onClick={(e, data) => IndexActions.setActiveItem(MENU_PRODUCT)}>
                        {locale.index_page_product_menu_title}
                    </Menu.Item>
                    <Menu.Item name={MENU_ORDER} active={activeItem === MENU_ORDER} onClick={(e, data) => IndexActions.setActiveItem(MENU_ORDER)}>
                        {locale.index_page_orders_menu_title}
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button content={locale.index_page_signout} icon='sign out' labelPosition='right' onClick={(e, data) => AuthActions.logoutUser()} />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <div style={activeItem === MENU_MATERIAL ? {} : { display: 'none' }}>
                    <Material />
                </div>

                <div style={activeItem === MENU_PRODUCT ? {} : { display: 'none' }}>
                    <Product />
                </div>

                <div style={activeItem === MENU_ORDER ? {} : { display: 'none' }}>
                    <Order />
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
