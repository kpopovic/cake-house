'use strict';

import React, { Component } from 'react';
import { Input, Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import locale from './../../javascripts/locale.js';

export default class OrderSearchFilter extends Reflux.Component {
    constructor() {
        super();
        this.state = { name: null };
    }

    handleOnChange(newState) {
        this.setState(newState, () => {
            this.props.onSearch(newState);
        });
    }

    render() {
        const { name } = this.state;
        return (
            <Input
                icon="search"
                placeholder={locale.order_table_search}
                onChange={(e, { value }) => {
                    this.handleOnChange(Object.assign({}, this.state, { name: value }))
                }}
            />
        )
    }
}

OrderSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired
};
