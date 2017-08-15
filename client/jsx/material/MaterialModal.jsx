'use strict';

import React, { Component } from 'react';
import { Button, Header, Modal, Form } from 'semantic-ui-react';
import Reflux from 'reflux';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions.js';
import MaterialModalStore from './../../javascripts/stores/MaterialModalStore';

export default class MaterialModal extends Reflux.Component {
    constructor() {
        super();
        this.store = MaterialModalStore;
    }

    render() {
        const { name, unit, quantityInStock, open } = this.state.mStore;
        return (
            <Modal dimmer='blurring' open={open} onClose={(e, data) => MaterialModalActions.closeModal()}>
                <Modal.Header>Add new material</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input
                                id='form-input-material-name'
                                defaultValue={name}
                                label='Name'
                                placeholder='Material name'
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldName(value)}
                            />
                            <Form.Select
                                id='form-input-material-unit'
                                defaultValue={unit}
                                label='Unit'
                                placeholder='Select material unit'
                                options={options}
                                simple
                                item
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldUnit(value)}
                            />
                            <Form.Input
                                id='form-input-material-quantity'
                                defaultValue={quantityInStock}
                                label='Quantity'
                                placeholder='Quantity in stock'
                                type='number'
                                onChange={(e, { value }) => MaterialModalActions.setFormFieldQuantityInStock(value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={(e, data) => MaterialModalActions.closeModal()}>
                        Cancel
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Save"
                        onClick={(e, data) => MaterialModalActions.saveOrUpdate()}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const options = [
    { key: 'L', text: 'Liter', value: 'L' },
    { key: 'kg', text: 'Kilogram', value: 'kg' }
]
