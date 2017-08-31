'use strict';

import React, { Component } from 'react';
import { Button, Grid, Header, Modal, Form, Input, Divider, Search, Table, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import ProductModalActions from './../../javascripts/actions/product-modal-actions';
import { buildStore } from './../../javascripts/stores/product-modal-store.js';
import locale from './../../javascripts/locale';

export default class ProductModal extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();

        ProductModalActions.save.completed.listen(() => {
            this.props.onSave();
        });
    }

    renderFilterForm(data) {
        const { name, searchedMaterials, selectedMaterial, materialQuantity, isSearchInProgress } = data;
        const disableButton = !(selectedMaterial && materialQuantity && materialQuantity > 0);

        const results = searchedMaterials.map(m => {
            return { id: m.id, title: m.name, description: locale[`material_unit_${m.unit}`] }
        });

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field
                        control={Search}
                        loading={isSearchInProgress}
                        results={results}
                        value={name}
                        noResultsMessage={locale.product_table_modal_material_noResultsMessage}
                        onResultSelect={(e, { result }) => ProductModalActions.selectMaterial(result.id)}
                        onSearchChange={(e, { value }) => ProductModalActions.searchMaterial(value)}
                    />
                    <Form.Input
                        placeholder={locale.product_table_modal_material_quantity}
                        type='number'
                        value={materialQuantity}
                        onChange={(e, { value }) => ProductModalActions.setMaterialQuantity(value)}
                    />
                    <Form.Button
                        disabled={disableButton}
                        primary
                        onClick={(e, data) => { ProductModalActions.addMaterial(selectedMaterial.id, materialQuantity) }}>
                        {locale.product_table_modal_btn_add}
                    </Form.Button>
                </Form.Group>
            </Form>
        )
    }

    renderInputForm(materials) {
        const renderTableBody = () => {
            const materialList = materials.map((material, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{material.name}</Table.Cell>
                        <Table.Cell>{material.unit}</Table.Cell>
                        <Table.Cell>{material.quantityRequiredForProduction}</Table.Cell>
                        <Table.Cell>
                            <Button color='red' onClick={(e, data) => { ProductModalActions.removeMaterial(material.id) }}>Remove</Button>
                        </Table.Cell>
                    </Table.Row>
                )
            });

            if (materialList.length > 0) {
                return (
                    <Table.Body>
                        {materialList}
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
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Unit</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Remove</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {renderTableBody()}
            </Table>
        )
    }

    render() {
        const { filter, productId, materials, open } = this.state.store;
        const headerTitle = productId ? locale.product_table_modal_edit_title : locale.product_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { ProductModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content scrolling>
                    {this.renderFilterForm(filter)}
                    <Divider />
                    {this.renderInputForm(materials)}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => { ProductModalActions.resetStore() }}>
                        {locale.btn_cancel}
                    </Button>
                    <Button
                        positive
                        //disabled={this.isDisableSaveButton()}
                        icon='checkmark'
                        labelPosition='right'
                        content={locale.btn_add}
                        onClick={(e, data) => { ProductModalActions.save() }}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

ProductModal.propTypes = {
    onSave: PropTypes.func.isRequired
};

