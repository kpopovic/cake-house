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
            console.log("saveOrUpdate fired");
            MaterialTableActions.listFirstPage(); // show first page
        });

        PaginationActions.pagination.listen(request => {
            console.log("pagination fired=" + JSON.stringify(request, null, 2));
            MaterialTableActions.listNextPage();
        });
    }

    componentDidMount() {
        console.log("Material.componentDidMount");
        MaterialTableActions.listFirstPage(); // run only once on page load
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={8}>
                    <MaterialTable id={1} />
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        )
    }
}
