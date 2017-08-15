'use strict';

import Reflux from 'reflux';
import MaterialModalActions from './../actions/material-modal-actions';
import rootUrl from './../web-root-url'
import _ from 'lodash';

export default class MaterialModalStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = MaterialModalActions;
        this.state = { mStore: { open: false } };
    }

    onSaveOrUpdate() {
        const thePromise = () => {
            const { id } = this.state.mStore;
            const data = _.pick(this.state.mStore, ['name', 'unit', 'quantityInStock']);
            if (id) {
                return $.ajax({
                    url: rootUrl + `/v1/material?materialId=${id}`,
                    type: 'PUT',
                    crossDomain: false,
                    dataType: 'json',
                    data: data
                });
            } else {
                return $.ajax({
                    url: rootUrl + "/v1/material",
                    type: 'POST',
                    crossDomain: false,
                    dataType: 'json',
                    data: data
                });
            }
        }

        const promise = thePromise();

        promise.done(data => {
            if (data.code === 0) {
                this.onCloseModal();
            }
        });

        promise.fail(error => {
            console.error(error);
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

    onCloseModal() {
        this.setState({ mStore: { open: false } });
    }

}
