'use strict';

import React, { Component } from 'react';
import { Input, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';

export default class MaterialSearchFilter extends Reflux.Component {
    constructor() {
        super();
        this.state = { name: null, isToBuy: false };
    }

    handleOnChange(newState) {
        this.setState(newState, () => {
            this.props.onSearch(newState);
        });
    }

    render() {
        const { name, toBuyChecked } = this.state;
        return (
            <Input
                label={
                    <Checkbox
                        label='Za kupiti'
                        checked={toBuyChecked}
                        onChange={(e, { checked }) => {
                            this.handleOnChange(Object.assign({}, this.state, { isToBuy: checked }))
                        }}
                    />
                }
                labelPosition='right'
                placeholder='Pretraga materijala'
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
