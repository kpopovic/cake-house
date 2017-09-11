'use strict';

import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import locale from './../../javascripts/locale.js';
import OrderSearchFilterActions from './../../javascripts/actions/order-search-filter-actions.js';
import { buildStore } from './../../javascripts/stores/order-search-filter-store.js';
import _ from 'lodash';
import moment from 'moment';

export default class OrderSearchFilter extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        OrderSearchFilterActions.filter.completed.listen(data => {
            this.props.onSearch(data);
        });
    }

    render() {
        const { name, state, deliveryDate } = this.state.store;

        return (
            <Form>
                <Form.Input
                    width={4}
                    icon="search"
                    placeholder={locale.order_table_search_placeholder}
                    value={name}
                    onChange={(e, { value }) => OrderSearchFilterActions.setName(value)}
                />
                <Form.Group inline>
                    <Form.Field control={Radio} label={locale.order_state_all} value='' checked={state === ''} onChange={(e, { value }) => OrderSearchFilterActions.setState(value)} />
                    <Form.Field control={Radio} label={locale.order_state_pending} value='pending' checked={state === 'pending'} onChange={(e, { value }) => OrderSearchFilterActions.setState(value)} />
                    <Form.Field control={Radio} label={locale.order_state_production} value='production' checked={state === 'production'} onChange={(e, { value }) => OrderSearchFilterActions.setState(value)} />
                    <Form.Field control={Radio} label={locale.order_state_done} value='done' checked={state === 'done'} onChange={(e, { value }) => OrderSearchFilterActions.setState(value)} />
                </Form.Group>
                <Form.Group inline>
                    <Form.Field
                        control={DatePicker}
                        placeholderText={locale.order_table_header_deliveryDate}
                        todayButton={locale.btn_today}
                        selected={deliveryDate.from}
                        onChange={(m, e) => OrderSearchFilterActions.setFromDeliveryDate(m)}
                    />
                    <Form.Field
                        control={DatePicker}
                        placeholderText={locale.order_table_header_deliveryDate}
                        todayButton={locale.btn_today}
                        selected={deliveryDate.to}
                        onChange={(m, e) => OrderSearchFilterActions.setToDeliveryDate(m)}
                    />
                </Form.Group>
            </Form>
        )
    }
}

OrderSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired
};
