'use strict';

import React, { Component } from 'react';
import { Button, Grid, Image, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
//import OrderModal from './OrderModal';
import OrderSearchFilter from './OrderSearchFilter';
import Pagination from './../Pagination';
import OrderModalActions from './../../javascripts/actions/order-modal-actions';
import OrderTableActions from './../../javascripts/actions/order-table-actions';
import { buildStore } from './../../javascripts/stores/order-table-store';
import locale from './../../javascripts/locale';
import moment from 'moment';

export default class OrderTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = buildStore(props.pageSize);
    }

    componentDidMount() {
        OrderTableActions.listFirstPage(); // run only once on page load
    }

    fillTableBody(orders) {
        if (Array.isArray(orders) && orders.length > 0) {
            const orderList = orders.map((order, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{order.name}</Table.Cell>
                        <Table.Cell>{moment.utc(order.deliveryDate).format('DD.MM.YYYY')}</Table.Cell>
                        <Table.Cell>{locale[`order_state_${order.state}`]}</Table.Cell>
                        <Table.Cell>{order.clientName}</Table.Cell>
                        <Table.Cell>{order.clientPhone}</Table.Cell>
                        <Table.Cell>{order.products.length}</Table.Cell>
                        <Table.Cell textAlign="center">
                            <Button onClick={(e, data) => { ProductModalActions.showModal(order) }}>
                                {locale.order_table_btn_edit}
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                )
            });

            return (
                <Table.Body>
                    {orderList}
                </Table.Body>
            )

        } else {
            return (
                <Table.Body>
                    <Table.Row key={1}>
                        <Table.Cell colSpan={7}>
                            <Image fluid src={locale.table_empty} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            )
        }
    }

    render() {
        const { list, hasNext, hasPrevious, filter } = this.state.store;
        return (
            <div>
                <OrderSearchFilter onSearch={filter => OrderTableActions.listFirstPage(filter)} />
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{locale.order_table_header_name}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_deliveryDate}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_state}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_clientName}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_clientPhone}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_quantity}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.order_table_header_edit}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {this.fillTableBody(list)}

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan={7}>
                                <Button
                                    primary
                                    floated='right'
                                    onClick={(e, data) => { OrderModalActions.showModal() }}>
                                    {locale.order_table_btn_add}
                                </Button>
                                <Pagination
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    onPrevious={() => OrderTableActions.listPreviousPage()}
                                    onNext={() => OrderTableActions.listNextPage()}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}

OrderTable.propTypes = {
    pageSize: PropTypes.number
};

OrderTable.defaultProps = {
    pageSize: 10
};
