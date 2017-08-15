'use strict';

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import MaterialTableActions from './../../javascripts/actions/material-table-actions';
import MaterialTable from './MaterialTable';
import Reflux from 'reflux';

export default class Material extends Reflux.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        MaterialTableActions.listMaterials();
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
