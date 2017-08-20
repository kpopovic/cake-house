'use strict';

import React, { Component } from 'react';
import { Button, Grid, Icon, Image, Table } from 'semantic-ui-react';
import Reflux from 'reflux';
import MaterialModal from './MaterialModal';
import Pagination from './../Pagination';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import MaterialTableStore from './../../javascripts/stores/MaterialTableStore';
import { buildStore } from './../../javascripts/stores/store-factory';
import locale from './../../javascripts/locale';

export default class MaterialTable extends Reflux.Component {
    constructor(props) {
        super(props);

        const { id } = props;
        this.storeId = "materialTableStore-" + id;
        this.store = buildStore(this.storeId, { limit: 5 });
    }

    fillTableBody(materials) {
        if (Array.isArray(materials) && materials.length > 0) {
            const itemList = materials.map((item, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.unit}</Table.Cell>
                        <Table.Cell>{item.quantityInStock}</Table.Cell>
                        <Table.Cell>{item.quantityToBuy}</Table.Cell>
                        <Table.Cell>
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
                        <Table.Cell colSpan='5'>
                            <Image fluid src={locale.material_table_empty} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            )
        }
    }

    render() {
        const { list } = this.state.mtStore;

        return (
            <div>
                <MaterialModal />
                <Table basic>
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
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan='5'>
                                <Button floated='right' primary onClick={(e, data) => MaterialModalActions.showModalAddMaterial()}>
                                    {locale.material_table_btn_add}
                                </Button>
                                <Pagination storeId={this.storeId} />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}
