'use strict';

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import ProductTable from './ProductTable';

export default class Product extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={7}>
                    <ProductTable />
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        )
    }
}
