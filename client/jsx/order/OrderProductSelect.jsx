'use strict';

import React, { Component } from 'react';
import { Button, Form, Input, Search } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderProductSelectActions from './../../javascripts/actions/order-product-select-actions';
import { buildStore } from './../../javascripts/stores/order-product-select-store.js';
import locale from './../../javascripts/locale';

export default class OrderProductSelect extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = buildStore();

        OrderProductSelectActions.stateChanged.completed.listen((product) => {
            this.props.onChange(product);
        });
    }

    render() {
        const disabled = this.props.disabled;
        const { productName, productQuantity, searchResult, selectedProduct } = this.state.store;
        const disableButton = !(disabled == false && selectedProduct != null && productQuantity > 0);
        const results = searchResult.map(m => {
            return { id: m.id, title: m.name }
        });

        return (
            <Form.Group widths='equal'>
                <Form.Field
                    control={Search}
                    disabled={disabled}
                    label={locale.order_table_modal_product_search}
                    placeholder={locale.order_table_modal_product_search_placeholder}
                    results={results}
                    value={productName}
                    noResultsMessage={locale.order_table_modal_product_noResultsMessage}
                    onResultSelect={(e, { result }) => OrderProductSelectActions.selectProduct(result.id)}
                    onSearchChange={(e, { value }) => OrderProductSelectActions.searchProduct(value)}
                />
                <Form.Input
                    disabled={disabled}
                    label={locale.order_table_modal_product_quantity}
                    placeholder={locale.order_table_modal_product_quantity_placeholder}
                    type='number'
                    min={1}
                    step={1}
                    value={productQuantity}
                    onChange={(e, { value }) => OrderProductSelectActions.setProductQuantity(value)}
                />
                <Form.Field disabled={disabled}>
                    <label style={{ whiteSpace: 'pre' }}> </label>
                    <Button
                        primary
                        disabled={disableButton}
                        onClick={(e, data) => { OrderProductSelectActions.addProduct() }}>
                        {locale.order_table_modal_btn_add}
                    </Button>
                </Form.Field>
            </Form.Group>
        )
    }
}

OrderProductSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

OrderProductSelect.defaultProps = {
    disabled: false
};
