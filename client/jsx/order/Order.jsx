'use strict';

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import OrderTable from './OrderTable';

export default class Order extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={10}>
                    <OrderTable />
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        )
    }
}
