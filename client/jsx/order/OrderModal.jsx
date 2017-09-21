'use strict';

import React, { Component } from 'react';
import { Button, Header, Modal, Form, Divider } from 'semantic-ui-react';
import OrderStateSelect from './OrderStateSelect';
import OrderInput from './OrderInput';
import OrderProductSelect from './OrderProductSelect';
import OrderModalTable from './OrderModalTable';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderModalActions from './../../javascripts/actions/order-modal-actions';
import { buildStore } from './../../javascripts/stores/order-modal-store.js';
import locale from './../../javascripts/locale';

export default class OrderModal extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        OrderModalActions.save.completed.listen(() => {
            this.props.onSave();
            OrderModalActions.resetStore(); // reset ALL stores (including OrderInputStore, OrderStateSelectStore, OrderProductSelectStore)
        });
    }

    render() {
        const { orderId, orderName, initialState, orderState, clientName, deliveryDate, products, isValid, isLocked, open } = this.state.store;
        const headerTitle = orderId ? locale.order_table_modal_edit_title : locale.order_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { OrderModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content scrolling>
                    <Form>
                        <OrderInput onChange={(state) => { OrderModalActions.update(state) }} disabled={isLocked} />
                        <OrderStateSelect onChange={(state) => { OrderModalActions.update(state) }} initialState={initialState} />
                        <OrderProductSelect onChange={(product) => { OrderModalTableActions.addProduct(product) }} disabled={isLocked} />
                    </Form>
                    <Divider />
                    <OrderModalTable onChange={(state) => { OrderModalActions.update(state) }} disabled={isLocked} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => { OrderModalActions.resetStore() }}>
                        {locale.btn_cancel}
                    </Button>
                    <Button
                        positive
                        disabled={isValid}
                        icon='checkmark'
                        labelPosition='right'
                        content={locale.btn_add}
                        onClick={(e, data) => { OrderModalActions.save() }}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

OrderModal.propTypes = {
    onSave: PropTypes.func.isRequired
};

