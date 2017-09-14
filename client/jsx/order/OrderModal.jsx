'use strict';

import React, { Component } from 'react';
import { Button, Checkbox, Grid, Header, Modal, Form, Input, Divider, Search, Table, Image } from 'semantic-ui-react';
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


    renderOrderForm(name, state, deliveryDate, clientName, clientPhone) {
        return (
            <Form>
                <Form.Group>
                    <Form.Input
                        label={locale.order_table_header_name}
                        placeholder={locale.order_table_search_placeholder}
                        value={name}
                        onChange={(e, { value }) => OrderModalActions.setOrderName(value)}
                    />
                    <Form.Field
                        control={DatePicker}
                        label={locale.order_table_header_deliveryDate}
                        placeholderText={locale.order_table_header_deliveryDate}
                        todayButton={locale.btn_today}
                        selected={deliveryDate}
                        onChange={(m, e) => OrderModalActions.setDeliveryDate(m)}
                    />
                    <Form.Input
                        label={locale.order_table_header_clientName}
                        placeholder={locale.order_table_header_clientName_placeholder}
                        value={clientName}
                        onChange={(e, { value }) => OrderModalActions.setClientName(value)}
                    />
                    <Form.Input
                        label={locale.order_table_header_clientPhone}
                        placeholder={locale.order_table_header_clientPhone_placeholder}
                        value={clientPhone}
                        onChange={(e, { value }) => OrderModalActions.setClientPhone(value)}
                    />
                </Form.Group>
                <Form.Group inline>
                    <label>{locale.order_table_header_state}</label>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='pending'
                            name='checkboxRadioGroup'
                            value='pending'
                            checked={state === 'pending'}
                            onChange={(e, { value }) => OrderModalActions.setOrderState(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='production'
                            name='checkboxRadioGroup'
                            value='production'
                            checked={state === 'production'}
                            onChange={(e, { value }) => OrderModalActions.setOrderState(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='done'
                            name='checkboxRadioGroup'
                            value='done'
                            checked={state === 'done'}
                            onChange={(e, { value }) => OrderModalActions.setOrderState(value)}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }

    renderFilterForm(data) {
        const { productName, searchedProducts, selectedProduct, productQuantity, isSearchInProgress } = data;
        const disableButton = !(selectedProduct && productQuantity && productQuantity > 0);

        const results = searchedProducts.map(m => {
            return { id: m.id, title: m.name }
        });

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field
                        label={locale.order_table_modal_product_search}
                        placeholder={locale.order_table_modal_product_search_placeholder}
                        control={Search}
                        loading={isSearchInProgress}
                        results={results}
                        value={productName}
                        noResultsMessage={locale.order_table_modal_product_noResultsMessage}
                        onResultSelect={(e, { result }) => OrderModalActions.selectProduct(result.id)}
                        onSearchChange={(e, { value }) => OrderModalActions.searchProduct(value)}
                    />
                    <Form.Input
                        label={locale.order_table_modal_product_quantity}
                        placeholder={locale.order_table_modal_product_quantity_placeholder}
                        type='number'
                        min={1}
                        step={1}
                        value={productQuantity}
                        onChange={(e, { value }) => OrderModalActions.setProductQuantity(value)}
                    />
                    <Form.Field>
                        <label style={{ whiteSpace: 'pre' }}> </label>
                        <Button
                            primary
                            disabled={disableButton}
                            onClick={(e, data) => { OrderModalActions.addProduct(selectedProduct.id, productQuantity) }}>
                            {locale.order_table_modal_btn_add}
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }

    renderInputForm(products) {
        const renderTableBody = () => {
            const productList = products.map((product, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>
                            <Button color='red' onClick={(e, data) => { OrderModalActions.removeProduct(product.id) }}>{locale.btn_remove}</Button>
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
        const { filter, orderId, orderName, deliveryDate, orderState, clientName, clientPhone, products, open } = this.state.store;
        const disableSaveBtn = products.length === 0 || orderName.length === 0 || clientName.length === 0 || deliveryDate == null;
        const headerTitle = orderId ? locale.order_table_modal_edit_title : locale.order_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { OrderModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content scrolling>
                    {this.renderOrderForm(orderName, orderState, deliveryDate, clientName, clientPhone)}
                    {this.renderFilterForm(filter)}
                    <Divider />
                    {this.renderInputForm(products)}
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

