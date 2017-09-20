'use strict';

import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderInputActions from './../../javascripts/actions/order-input-actions.js';
import { buildStore } from './../../javascripts/stores/order-input-store.js';
import locale from './../../javascripts/locale';

export default class OrderInput extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = buildStore();

        OrderInputActions.stateChanged.completed.listen((state) => {
            this.props.onChange(state);
        });
    }

    render() {
        const disabled = this.props.disabled;
        const { orderName, clientName, clientPhone, deliveryDate } = this.state;
        return (
            <Form.Group widths='equal'>
                <Form.Input
                    disabled={disabled}
                    label={locale.order_table_header_name}
                    placeholder={locale.order_table_search_placeholder}
                    value={orderName}
                    onChange={(e, { value }) => OrderInputActions.setOrderName(value)}
                />
                <Form.Field
                    disabled={disabled}
                    control={DatePicker}
                    label={locale.order_table_header_deliveryDate}
                    placeholderText={locale.order_table_header_deliveryDate}
                    todayButton={locale.btn_today}
                    selected={deliveryDate}
                    onChange={(moment, e) => OrderInputActions.setDeliveryDate(moment)}
                />
                <Form.Input
                    disabled={disabled}
                    label={locale.order_table_header_clientName}
                    placeholder={locale.order_table_header_clientName_placeholder}
                    value={clientName}
                    onChange={(e, { value }) => OrderInputActions.setClientName(value)}
                />
                <Form.Input
                    disabled={disabled}
                    label={locale.order_table_header_clientPhone}
                    placeholder={locale.order_table_header_clientPhone_placeholder}
                    value={clientPhone}
                    onChange={(e, { value }) => OrderInputActions.setClientPhone(value)}
                />
            </Form.Group>
        )
    }
}

OrderInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

OrderInput.defaultProps = {
    disabled: false
};
