'use strict';

import React, { Component } from 'react';
import { Button, Header, Modal, Form, Divider, Input, Search, Label, Checkbox, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderModalActions from './../../javascripts/actions/order-modal-actions';
import { buildStore } from './../../javascripts/stores/order-modal-store.js';
import locale from './../../javascripts/locale';
import _ from 'lodash';

export default class OrderModal extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        OrderModalActions.save.completed.listen(() => {
            this.props.onSave();
            OrderModalActions.resetStore();
        });
    }

    renderOrderInput(data) {
        const { initialState, orderName, clientName, clientPhone, deliveryDate, isOrderLocked } = data;

        return (
            <Form.Group widths='equal'>
                <Form.Input
                    disabled={isOrderLocked}
                    label={locale.order_table_header_name}
                    placeholder={locale.order_table_search_placeholder}
                    value={orderName}
                    onChange={(e, { value }) => OrderModalActions.setOrderName(value)}
                />
                <Form.Field
                    disabled={isOrderLocked}
                    control={DatePicker}
                    label={locale.order_table_header_deliveryDate}
                    placeholderText={locale.order_table_header_deliveryDate}
                    todayButton={locale.btn_today}
                    selected={deliveryDate}
                    onChange={(moment, e) => OrderModalActions.setDeliveryDate(moment)}
                />
                <Form.Input
                    disabled={isOrderLocked}
                    label={locale.order_table_header_clientName}
                    placeholder={locale.order_table_header_clientName_placeholder}
                    value={clientName}
                    onChange={(e, { value }) => OrderModalActions.setClientName(value)}
                />
                <Form.Input
                    disabled={isOrderLocked}
                    label={locale.order_table_header_clientPhone}
                    placeholder={locale.order_table_header_clientPhone_placeholder}
                    value={clientPhone}
                    onChange={(e, { value }) => OrderModalActions.setClientPhone(value)}
                />
            </Form.Group>
        )
    }

    renderOrderStateSelect(data) {
        const { initialState, currentState, isOrderLocked } = data;

        return (
            <Form.Group inline>
                <Form.Field>
                    <Label basic active={!isOrderLocked}>{locale.order_table_header_state}</Label>
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={isOrderLocked}
                        radio
                        label={locale.order_state_pending}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_PENDING}
                        checked={currentState === STATE_PENDING}
                        onChange={(e, { value }) => OrderModalActions.setState(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={isOrderLocked}
                        radio
                        label={locale.order_state_production}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_PRODUCTION}
                        checked={currentState === STATE_PRODUCTION}
                        onChange={(e, { value }) => OrderModalActions.setState(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        disabled={isOrderLocked || initialState === STATE_PENDING}
                        radio
                        label={locale.order_state_done}
                        name={RADIO_BUTTON_GROUP}
                        value={STATE_DONE}
                        checked={currentState === STATE_DONE}
                        onChange={(e, { value }) => OrderModalActions.setState(value)}
                    />
                </Form.Field>
            </Form.Group>
        )
    }

    renderOrderProductSelect(data) {
        const { initialState, productSelect, isOrderLocked } = data;
        const { name, searchResult, selected } = data.productSelect;
        const quantity = _.get(selected, 'quantity', '');
        const disableButton = !(!isOrderLocked && quantity > 0);

        const results = searchResult.map(m => {
            return { id: m.id, title: m.name }
        });

        return (
            <Form.Group widths='equal'>
                <Form.Field
                    control={Search}
                    disabled={isOrderLocked}
                    label={locale.order_table_modal_product_search}
                    placeholder={locale.order_table_modal_product_search_placeholder}
                    results={results}
                    value={name}
                    noResultsMessage={locale.order_table_modal_product_noResultsMessage}
                    onResultSelect={(e, { result }) => OrderModalActions.selectProduct(result.id)}
                    onSearchChange={(e, { value }) => OrderModalActions.searchProduct(value)}
                />
                <Form.Input
                    disabled={isOrderLocked}
                    label={locale.order_table_modal_product_quantity}
                    placeholder={locale.order_table_modal_product_quantity_placeholder}
                    type='number'
                    min={1}
                    step={1}
                    value={quantity}
                    onChange={(e, { value }) => OrderModalActions.setProductQuantity(value)}
                />
                <Form.Field disabled={isOrderLocked}>
                    <label style={{ whiteSpace: 'pre' }}> </label>
                    <Button
                        primary
                        disabled={disableButton}
                        onClick={(e, data) => { OrderModalActions.addProduct() }}>
                        {locale.order_table_modal_btn_add}
                    </Button>
                </Form.Field>
            </Form.Group>
        )
    }

    renderOrderModalTable(data) {
        const { initialState, products } = data;
        const readOnly = initialState === STATE_DONE;

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
        const { orderId, open, isOrderLocked } = this.state.store;
        const disableSaveButton = isOrderLocked;
        const headerTitle = orderId ? locale.order_table_modal_edit_title : locale.order_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { OrderModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content scrolling>
                    <Form>
                        {this.renderOrderInput(this.state.store)}
                        {this.renderOrderStateSelect(this.state.store)}
                        {this.renderOrderProductSelect(this.state.store)}
                    </Form>
                    <Divider />
                    {this.renderOrderModalTable(this.state.store)}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => { OrderModalActions.resetStore() }}>
                        {locale.btn_cancel}
                    </Button>
                    <Button
                        positive
                        disabled={disableSaveButton}
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

const RADIO_BUTTON_GROUP = 'orderStateCheckboxRadioGroup';
const STATE_PENDING = 'pending';
const STATE_PRODUCTION = 'production';
const STATE_DONE = 'done';

OrderModal.propTypes = {
    onSave: PropTypes.func.isRequired
};

