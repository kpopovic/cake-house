'use strict';

import React, { Component } from 'react';
import { Button, Grid, Image, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import MaterialModal from './MaterialModal';
import MaterialSearchFilter from './MaterialSearchFilter';
import Pagination from './../Pagination';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions.js';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import { buildStore as tableStore } from './../../javascripts/stores/MaterialTableStore';
import locale from './../../javascripts/locale';

export default class MaterialTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = tableStore(props.pageSize);
    }

    componentDidMount() {
        MaterialTableActions.listFirstPage(); // run only once on page load
    }

    fillTableBody(materials) {
        if (Array.isArray(materials) && materials.length > 0) {
            const itemList = materials.map((item, index) => {
                const isNegative = item.quantityToBuy > 0;
                return (
                    <Table.Row key={index}>
                        <Table.Cell negative={isNegative}>{item.name}</Table.Cell>
                        <Table.Cell negative={isNegative}>{locale[`material_unit_${item.unit}`]}</Table.Cell>
                        <Table.Cell negative={isNegative}>{item.quantityInStock}</Table.Cell>
                        <Table.Cell negative={isNegative}>{item.quantityToBuy}</Table.Cell>
                        <Table.Cell textAlign="center">
                            <Button onClick={(e, data) => MaterialModalActions.showModalUpdateMaterial(item)}>
                                {locale.material_table_btn_edit}
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                )
            });

            return (
                <Table.Body>
                    {itemList}
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
        const { list, hasNext, hasPrevious, filter } = this.state.mtStore;
        return (
            <div>
                <MaterialModal
                    onCreate={() => MaterialTableActions.listFirstPage()}
                    onUpdate={() => MaterialTableActions.listFirstPage()}
                />
                <MaterialSearchFilter onSearch={filter => MaterialTableActions.listFirstPage(filter)} />
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{locale.material_table_header_name}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.material_table_header_unit}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.material_table_header_quantityInStock}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.material_table_header_quantityToBuy}</Table.HeaderCell>
                            <Table.HeaderCell>{locale.material_table_header_edit}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {this.fillTableBody(list)}

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan={5}>
                                <Button floated='right' primary onClick={(e, data) => MaterialModalActions.showModalAddMaterial()}>
                                    {locale.material_table_btn_add}
                                </Button>
                                <Pagination
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    onPrevious={() => MaterialTableActions.listPreviousPage()}
                                    onNext={() => MaterialTableActions.listNextPage()}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}

MaterialTable.propTypes = {
    pageSize: PropTypes.number
};

MaterialTable.defaultProps = {
    pageSize: 10
};
