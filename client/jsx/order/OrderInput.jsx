'use strict';

import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderModalActions from './../../javascripts/actions/order-modal-actions';
import { buildStore } from './../../javascripts/stores/order-modal-store.js';
import locale from './../../javascripts/locale';
import moment from 'moment';

export default class OrderInput extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        OrderModalActions.save.completed.listen(() => {
            this.props.onSave();
        });
    }

    render() {
        return (
            <Form.Group>
                <Form.Input
                    disabled={readOnly}
                    label={locale.order_table_header_name}
                    placeholder={locale.order_table_search_placeholder}
                    value={name}
                    onChange={(e, { value }) => OrderModalActions.setOrderName(value)}
                />
                <Form.Field
                    disabled={readOnly}
                    control={DatePicker}
                    label={locale.order_table_header_deliveryDate}
                    placeholderText={locale.order_table_header_deliveryDate}
                    todayButton={locale.btn_today}
                    selected={deliveryDate}
                    onChange={(m, e) => OrderModalActions.setDeliveryDate(m)}
                />
                <Form.Input
                    disabled={readOnly}
                    label={locale.order_table_header_clientName}
                    placeholder={locale.order_table_header_clientName_placeholder}
                    value={clientName}
                    onChange={(e, { value }) => OrderModalActions.setClientName(value)}
                />
                <Form.Input
                    disabled={readOnly}
                    label={locale.order_table_header_clientPhone}
                    placeholder={locale.order_table_header_clientPhone_placeholder}
                    value={clientPhone}
                    onChange={(e, { value }) => OrderModalActions.setClientPhone(value)}
                />
            </Form.Group>
        )
    }
}

OrderInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    initialState: PropTypes.oneOf([STATE_PENDING, STATE_PRODUCTION, STATE_DONE]).isRequired,
};
