'use strict';

import React, { Component } from 'react';
import { Button, Grid, Icon, Image, Table } from 'semantic-ui-react';
import Reflux from 'reflux';
import MaterialModal from './MaterialModal';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import MaterialTableStore from './../../javascripts/stores/MaterialTableStore';

export default class MaterialTable extends Reflux.Component {
    constructor() {
        super();
        this.store = MaterialTableStore;
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
                                Edit
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
                            <Image fluid src='https://semantic-ui.com/images/wireframe/media-paragraph.png' />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            )
        }
    }

    render() {
        const { materials } = this.state.mtStore;

        return (
            <div>
                <MaterialModal />
                <Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>name</Table.HeaderCell>
                            <Table.HeaderCell>unit</Table.HeaderCell>
                            <Table.HeaderCell>quantityInStock</Table.HeaderCell>
                            <Table.HeaderCell>quantityToBuy</Table.HeaderCell>
                            <Table.HeaderCell>edit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {this.fillTableBody(materials)}

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan='5'>
                                <Button floated='right' primary onClick={(e, data) => MaterialModalActions.showModalAddMaterial()}>
                                    Add material
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}
