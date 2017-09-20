'use strict';

import React, { Component } from 'react';
import { Button, Checkbox, Grid, Header, Modal, Form, Input, Divider, Search, Table, Image } from 'semantic-ui-react';
import OrderStateSelect from './OrderStateSelect';
import OrderInput from './OrderInput';
import OrderProductSelect from './OrderProductSelect';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderModalActions from './../../javascripts/actions/order-modal-actions';
import { buildStore } from './../../javascripts/stores/order-modal-store.js';
import locale from './../../javascripts/locale';
import moment from 'moment';

export default class OrderModal extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        OrderModalActions.save.completed.listen(() => {
            this.props.onSave();
        });
    }

    renderOrderForm() {
        return (
            <Form>
                <OrderInput onChange={(state) => { console.log(state) }} disabled={false} />
                <OrderStateSelect onChange={(state) => { console.log(state) }} initialState='pending' />
                <OrderProductSelect onChange={(product) => { console.log(JSON.stringify(product, null, 2)) }} disabled={false} />
            </Form>
        )
    }

    renderInputForm(products, readOnly) {
        const renderTableBody = () => {
            const productList = products.map((product, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>
                            <Button
                                disabled={readOnly}
                                color='red'
                                onClick={(e, data) => { OrderModalActions.removeProduct(product.id) }}>{locale.btn_remove}</Button>
                        </Table.Cell>
                    </Table.Row>
                )
            });

            if (productList.length > 0) {
                return (
                    <Table.Body>
                        {productList}
                    </Table.Body>
                )
            } else {
                return (
                    <Table.Body>
                        <Table.Row key={1}>
                            <Table.Cell colSpan={5}>
                                <Image fluid src={locale.table_empty} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )
            }
        } // end of renderTableBody function

        return (
            <Table basic>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{locale.order_table_header_name}</Table.HeaderCell>
                        <Table.HeaderCell>{locale.order_table_header_quantity}</Table.HeaderCell>
                        <Table.HeaderCell>{locale.order_table_header_edit}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {renderTableBody()}
            </Table>
        )
    }

    render() {
        const { filter, orderId, orderName, deliveryDate, orderState, clientName, clientPhone, products, open, readOnlyAll, readOnlyDoneButton } = this.state.store;
        const disableSaveBtn = products.length === 0 || orderName.length === 0 || clientName.length === 0 || deliveryDate == null || readOnlyAll;
        const headerTitle = orderId ? locale.order_table_modal_edit_title : locale.order_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { OrderModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content scrolling>
                    {this.renderOrderForm()}
                    <Divider />
                    {this.renderInputForm(products, readOnlyAll)}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => { OrderModalActions.resetStore() }}>
                        {locale.btn_cancel}
                    </Button>
                    <Button
                        positive
                        disabled={disableSaveBtn}
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

const options = [
    { key: 'pending', text: `${locale.order_state_pending}`, value: 'pending' },
    { key: 'production', text: `${locale.order_state_production}`, value: 'production' },
    { key: 'done', text: `${locale.order_state_done}`, value: 'done' }
]

OrderModal.propTypes = {
    onSave: PropTypes.func.isRequired
};

