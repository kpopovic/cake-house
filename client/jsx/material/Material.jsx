'use strict';

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import MaterialTable from './MaterialTable';

export default class Material extends React.Component {
    constructor() {
        super();
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
