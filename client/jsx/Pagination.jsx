'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import Reflux from 'reflux';
import { buildStore } from './../javascripts/stores/store-factory';
import PaginationActions from './../javascripts/actions/pagination-actions';

export default class Pagination extends Reflux.Component {
    constructor(props) {
        super(props);

        this.storeId = props.storeId;
        this.store = buildStore(this.storeId); // e.g. materials, products, orders, ...
    }

    render() {
        const rootNodeName = Object.keys(this.state)[0];
        const { hasPrevious, hasNext } = this.state[rootNodeName];
        console.log("Pagination=" + JSON.stringify(this.state, null, 2));
        const visible = hasPrevious || hasNext;

        return (
            <div style={visible ? {} : { display: 'none' }}>
                <Button
                    disabled={!hasPrevious}
                    content={locale.pagination_btn_previous}
                    icon='left arrow'
                    labelPosition='left'
                    onClick={(e, data) => { PaginationActions.pagination(Object.assign({}, { storeId: this.storeId, direction: 'back' })) }} />
                <Button
                    disabled={!hasNext}
                    content={locale.pagination_btn_next}
                    icon='right arrow'
                    labelPosition='right'
                    onClick={(e, data) => { PaginationActions.pagination(Object.assign({}, { storeId: this.storeId, direction: 'next' })) }} />
            </div>
        )
    }
}

/*
Pagination.propTypes = {
    storeId: PropTypes.string.isRequired,
    limit: PropTypes.number
};

Pagination.defaultProps = {
    limit: 10
};*/
