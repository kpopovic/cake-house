'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import locale from '../javascripts/locale.js';
import Reflux from 'reflux';

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        const { hasPrevious, hasNext } = props;
        this.state = { hasPrevious: hasPrevious, hasNext: hasNext };
    }

    componentWillReceiveProps(nextProps) {
        const { hasPrevious, hasNext } = nextProps;
        this.setState({ hasPrevious: hasPrevious, hasNext: hasNext });
    }

    render() {
        const { hasPrevious, hasNext } = this.state;
        const visible = hasPrevious || hasNext;

        return (
            <div style={visible ? {} : { display: 'none' }}>
                <Button
                    disabled={!hasPrevious}
                    content={locale.pagination_btn_previous}
                    icon='left arrow'
                    labelPosition='left'
                    onClick={(e, data) => { this.props.onPrevious() }}
                />
                <Button
                    disabled={!hasNext}
                    content={locale.pagination_btn_next}
                    icon='right arrow'
                    labelPosition='right'
                    onClick={(e, data) => { this.props.onNext() }}
                />
            </div>
        )
    }
}

Pagination.propTypes = {
    hasPrevious: PropTypes.bool.isRequired,
    hasNext: PropTypes.bool.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
};
