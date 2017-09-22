'use strict';

import React, { Component } from 'react';
import { Checkbox, Form, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderStateSelectActions from './../../javascripts/actions/order-state-select-actions';
import { buildStore } from './../../javascripts/stores/order-state-select-store';
import locale from './../../javascripts/locale';

export default class OrderStateSelect extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = buildStore(props.initialState);

        OrderStateSelectActions.setState.completed.listen((currentState) => {
            this.props.onChange(currentState);
        });
    }

    render() {
        const { initialState, currentState } = this.state.store;
        const readOnly = initialState === STATE_DONE; // not possible to change order state any more !

        return (
            <Form.Group inline>
                <Form.Field>
                    <Label
                        disabled={readOnly}
                        basic>{locale.order_table_header_state}</Label>
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={readOnly}
                        radio
                        label={locale.order_state_pending}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_PENDING}
                        checked={currentState === STATE_PENDING}
                        onChange={(e, { value }) => OrderStateSelectActions.setState(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={readOnly}
                        radio
                        label={locale.order_state_production}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_PRODUCTION}
                        checked={currentState === STATE_PRODUCTION}
                        onChange={(e, { value }) => OrderStateSelectActions.setState(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={readOnly || initialState === STATE_PENDING}
                        radio
                        label={locale.order_state_done}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_DONE}
                        checked={currentState === STATE_DONE}
                        onChange={(e, { value }) => OrderStateSelectActions.setState(value)}
                    />
                </Form.Field>
            </Form.Group>
        )
    }
}

const RADIO_BUTTON_GROUP = 'orderStateCheckboxRadioGroup';
const STATE_PENDING = 'pending';
const STATE_PRODUCTION = 'production';
const STATE_DONE = 'done';

OrderStateSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    initialState: PropTypes.oneOf([STATE_PENDING, STATE_PRODUCTION, STATE_DONE]).isRequired,
};
