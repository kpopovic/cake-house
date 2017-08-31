'use strict';

import React, { Component } from 'react';
import { Button, Grid, Image, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import ProductModal from './ProductModal';
import ProductSearchFilter from './ProductSearchFilter';
import Pagination from './../Pagination';
import ProductModalActions from './../../javascripts/actions/product-modal-actions';
import ProductTableActions from './../../javascripts/actions/product-table-actions';
import { buildStore as tableStore } from './../../javascripts/stores/product-table-store';
import locale from './../../javascripts/locale';

export default class ProductTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = tableStore(props.pageSize);
    }

    componentDidMount() {
        ProductTableActions.listFirstPage(); // run only once on page load
    }

    fillTableBody(products) {
        if (Array.isArray(products) && products.length > 0) {
            const productList = products.map((product, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.materials.length}</Table.Cell>
                        <Table.Cell>
                            <Button onClick={(e, data) => { ProductModalActions.showModal(product) }}>
                                {locale.material_table_btn_edit}
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                )
            });

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
    }

    render() {
        const { list, hasNext, hasPrevious, filter } = this.state.mpStore;
        return (
            <div>
                <ProductSearchFilter onSearch={filter => ProductTableActions.listFirstPage(filter)} />
                <ProductModal onSave={() => ProductTableActions.listFirstPage()} />
                <Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{locale.product_table_header_name}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.product_table_header_quantity}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.product_table_header_edit}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {this.fillTableBody(list)}

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan={5}>
                                <Button
                                    primary
                                    floated='right'
                                    onClick={(e, data) => { ProductModalActions.showModal() }}>
                                    {locale.product_table_btn_add}
                                </Button>
                                <Pagination
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    onPrevious={() => ProductTableActions.listPreviousPage()}
                                    onNext={() => ProductTableActions.listNextPage()}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}

ProductTable.propTypes = {
    pageSize: PropTypes.number
};

ProductTable.defaultProps = {
    pageSize: 10
};
