'use strict';

import React, { Component } from 'react';
import { Button, Form, Input, Image, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import OrderModalTableActions from './../../javascripts/actions/order-modal-table-actions.js';
import { buildStore } from './../../javascripts/stores/order-modal-table-store.js';
import locale from './../../javascripts/locale';

export default class OrderModalTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = buildStore(props.products);

        OrderModalTableActions.stateChanged.completed.listen((products) => {
            this.props.onChange(products);
        });
    }

    render() {
        const disabled = this.props.disabled;
        const { products } = this.state;

        const renderTableBody = () => {
            const productList = products.map((product, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>
                            <Button
                                disabled={disabled}
                                color='red'
                                onClick={(e, data) => { OrderModalTableActions.removeProduct(product.id) }}>{locale.btn_remove}</Button>
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
}

OrderModalTable.propTypes = {
    onChange: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    disabled: PropTypes.bool
};

OrderModalTable.defaultProps = {
    disabled: false
};
