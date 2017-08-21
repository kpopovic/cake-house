'use strict';

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import PaginationActions from './../../javascripts/actions/pagination-actions';
import MaterialModalActions from './../../javascripts/actions/material-modal-actions';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import MaterialTable from './MaterialTable';
import Reflux from 'reflux';

export default class Material extends Reflux.Component {
    constructor() {
        super();

        MaterialModalActions.saveOrUpdate.completed.listen(() => { // material model store will trigger 'completed'
            MaterialTableActions.listFirstPage(); // show first page
        });

        PaginationActions.pagination.listen(request => {
            const isNext = request.direction === 'next';
            if (isNext) {
                MaterialTableActions.listNextPage();
            } else {
                MaterialTableActions.listPreviousPage();
            }
        });
    }

    componentDidMount() {
        MaterialTableActions.listFirstPage(); // run only once on page load
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={8}>
                    <MaterialTable />
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        )
    }
}
