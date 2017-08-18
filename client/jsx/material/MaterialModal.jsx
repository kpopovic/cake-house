'use strict';

import React, { Component } from 'react';
import { Button, Header, Modal, Form } from 'semantic-ui-react';
import Reflux from 'reflux';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions.js';
import MaterialModalStore from './../../javascripts/stores/MaterialModalStore';
import locale from './../../javascripts/locale';
//import _ from 'lodash';

export default class MaterialModal extends Reflux.Component {
    constructor() {
        super();
        this.store = MaterialModalStore;

        MaterialModalActions.saveOrUpdate.completed.listen(() => { // store will trigger 'completed'
            MaterialTableActions.listMaterials();
        });
    }

    isDisableSaveButton() {
        const { name, unit, quantityInStock, open } = this.state.mStore;
        const isValidName = name && name.length > 0;
        const isValidUnit = unit && unit.length > 0;
        const quantityInStockAsNumber = parseFloat(quantityInStock);
        const isValidNumber = isFinite(quantityInStockAsNumber) && quantityInStockAsNumber >= 0;

        return !(isValidName && isValidUnit && isValidNumber);
    }

    render() {
        const { id, name, unit, quantityInStock, open } = this.state.mStore;
        const headerTitle = id ? locale.material_table_modal_edit_title : locale.material_table_modal_add_title;
        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => MaterialModalActions.resetStore()}>
                <Modal.Header>{headerTitle}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input
                                id='form-input-material-name'
                                defaultValue={name}
                                label={locale.material_table_header_name}
                                placeholder={locale.material_table_modal_name_content}
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldName(value)}
                            />
                            <Form.Select
                                id='form-input-material-unit'
                                defaultValue={unit}
                                label={locale.material_table_header_unit}
                                placeholder={locale.material_table_modal_unit_content}
                                options={options}
                                simple
                                item
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldUnit(value)}
                            />
                            <Form.Input
                                id='form-input-material-quantity'
                                defaultValue={quantityInStock}
                                label={locale.material_table_modal_quantityInStock}
                                placeholder={locale.material_table_modal_quantityInStock_content}
                                type='number'
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldQuantityInStock(value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => MaterialModalActions.resetStore()}>
                        {locale.material_table_modal_btn_cancel}
                    </Button>
                    <Button
                        positive
                        disabled={this.isDisableSaveButton()}
                        icon='checkmark'
                        labelPosition='right'
                        content={locale.material_table_modal_btn_add}
                        onClick={(e, data) => MaterialModalActions.saveOrUpdate()}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const options = [
    { key: 'L', text: `${locale.material_type_L}`, value: 'L' },
    { key: 'kg', text: `${locale.material_type_kg}`, value: 'kg' }
]
