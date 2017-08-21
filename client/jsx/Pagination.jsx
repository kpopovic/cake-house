'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import Reflux from 'reflux';
import PaginationActions from './../javascripts/actions/pagination-actions';

export default class Pagination extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    render() {
        const { storeId, hasPrevious, hasNext } = this.state;
        const visible = hasPrevious || hasNext;

        return (
            <div style={visible ? {} : { display: 'none' }}>
                <Button
                    disabled={!hasPrevious}
                    content={locale.pagination_btn_previous}
                    icon='left arrow'
                    labelPosition='left'
                    onClick={(e, data) => { PaginationActions.pagination({ storeId: storeId, direction: 'back' }) }} />
                <Button
                    disabled={!hasNext}
                    content={locale.pagination_btn_next}
                    icon='right arrow'
                    labelPosition='right'
                    onClick={(e, data) => { PaginationActions.pagination({ storeId: storeId, direction: 'next' }) }} />
            </div>
        )
    }
}

Pagination.propTypes = {
    storeId: PropTypes.string.isRequired,
    hasPrevious: PropTypes.bool.isRequired,
    hasNext: PropTypes.bool.isRequired,
};
