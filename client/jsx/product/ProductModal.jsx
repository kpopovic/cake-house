'use strict';

import React, { Component } from 'react';
import { Button, Grid, Header, Modal, Form, Input, Divider, Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import ProductModalActions from './../../javascripts/actions/product-modal-actions';
import { buildStore } from './../../javascripts/stores/product-modal-store.js';
import locale from './../../javascripts/locale';

export default class ProductModal extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();
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

    renderInputForm() {
        return (
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Field>
                                    <label>Mlijeko</label>
                                    <Input type="number" label={{ basic: true, content: 'kg' }} labelPosition='right' placeholder={locale.product_table_modal_material_quantity} />
                                </Form.Field>
                                <Form.Field>
                                    <label style={{ whiteSpace: 'pre' }}> </label>
                                    <Button color='red'>Ukloni materijal</Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Field>
                                    <label>Mlijeko</label>
                                    <Input type="number" label={{ basic: true, content: 'kg' }} labelPosition='right' placeholder={locale.product_table_modal_material_quantity} />
                                </Form.Field>
                                <Form.Field>
                                    <label style={{ whiteSpace: 'pre' }}> </label>
                                    <Button color='red'>Ukloni materijal</Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Field>
                                    <label>Mlijeko</label>
                                    <Input type="number" label={{ basic: true, content: 'kg' }} labelPosition='right' placeholder={locale.product_table_modal_material_quantity} />
                                </Form.Field>
                                <Form.Field>
                                    <label style={{ whiteSpace: 'pre' }}> </label>
                                    <Button color='red'>Ukloni materijal</Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    render() {
        const { filter, currentProduct, open } = this.state.store;
        const headerTitle = currentProduct ? locale.product_table_modal_edit_title : locale.product_table_modal_add_title;

        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => { ProductModalActions.resetStore() }}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content>
                    {this.renderFilterForm(filter)}
                    <Divider />
                    {this.renderInputForm()}
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
                        onClick={(e, data) => { }}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
