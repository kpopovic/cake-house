'use strict';

import Reflux from 'reflux';
import MaterialModalActions from './../actions/material-modal-actions';
import _ from 'lodash';
import axios from 'axios';

export default class MaterialModalStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = MaterialModalActions;
        this.state = { mStore: { open: false } };
    }

    onCreateOrUpdate() {
        const { id } = this.state.mStore;
        const thePromise = () => {
            const data = _.pick(this.state.mStore, ['name', 'unit', 'quantityInStock']);
            if (id) {
                return axios.put(`/v1/material?materialId=${id}`, data);
            } else {
                return axios.post('/v1/material', data);
            }
        }

        thePromise().then(response => {
            if (response.data.code === 0) {
                this.onResetStore();
                MaterialModalActions.createOrUpdate.completed({ action: id ? 'update' : 'create' });
            } else {
                console.error(JSON.stringify(response.data, null, 2));
                MaterialModalActions.createOrUpdate.failed();
            }
        }).catch(error => {
            console.error(error);
            MaterialModalActions.createOrUpdate.failed(error);
        });
    }

    onSetFormFieldName(name) {
        const data = Object.assign({}, this.state.mStore, { name: name });
        this.setState({ mStore: data });
    }

    onSetFormFieldUnit(unit) {
        const data = Object.assign({}, this.state.mStore, { unit: unit });
        this.setState({ mStore: data });
    }

    onSetFormFieldQuantityInStock(quantityInStock) {
        const data = Object.assign({}, this.state.mStore, { quantityInStock: quantityInStock });
        this.setState({ mStore: data });
    }

    onShowModalAddMaterial() {
        this.setState({ mStore: { open: true } });
    }

    onShowModalUpdateMaterial(selectedRow) {
        const model = _.pick(selectedRow, ['id', 'name', 'unit', 'quantityInStock']);
        const data = Object.assign(this.state.mStore, model, { open: true });
        this.setState({ mStore: data });
    }

    onResetStore() {
        this.setState({ mStore: { open: false } });
    }

}
