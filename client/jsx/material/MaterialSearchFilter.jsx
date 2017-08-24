'use strict';

import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import locale from './../../javascripts/locale.js';

export default class MaterialSearchFilter extends Reflux.Component {
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
                placeholder={locale.material_table_search}
                onChange={(e, { value }) => {
                    this.handleOnChange(Object.assign({}, this.state, { name: value }))
                }}
            />
        )
    }
}

MaterialSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired
};
