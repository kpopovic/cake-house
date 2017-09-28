'use strict';

import React, { Component } from 'react';
import { Button, Input, Search, Form, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import locale from './../../javascripts/locale.js';
import MaterialSearchFilterActions from './../../javascripts/actions/material-search-filter-actions';
import { buildStore } from './../../javascripts/stores/material-search-filter-store';

export default class MaterialSearchFilter extends Reflux.Component {
    constructor() {
        super();
        this.store = buildStore();
        MaterialSearchFilterActions.stateChanged.completed.listen(state => {
            this.props.onSearch(state);
        });
    }

    render() {
        const { name, isQuantityToBuy } = this.state.store;
        const { showShoppingListButton } = this.props;
        return (
            <Form>
                <Form.Group inline>
                    <Input
                        icon="search"
                        value={name}
                        placeholder={locale.material_table_search}
                        onChange={(e, { value }) => MaterialSearchFilterActions.setName(value)}
                    />
                    <Form.Field>
                        <label style={{ whiteSpace: 'pre' }}> </label>
                        <Checkbox
                            label={locale.material_table_header_quantityToBuy}
                            checked={isQuantityToBuy}
                            onChange={(e, { checked }) => MaterialSearchFilterActions.setQuantityToBuy(checked)}
                        />
                    </Form.Field>
                    <div style={showShoppingListButton ? {} : { display: 'none' }}>
                        <Form.Field>
                            <label style={{ whiteSpace: 'pre' }}> </label>
                            <Button
                                icon='download'
                                content={locale.material_table_shoppingList_btn}
                                labelPosition='left'
                                onClick={() => MaterialSearchFilterActions.downloadShoppingList()}
                            />
                        </Form.Field>
                    </div>
                </Form.Group>
            </Form>
        )
    }
}

MaterialSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    showQuantityToBuyButton: PropTypes.bool
};

MaterialSearchFilter.defaultProps = {
    showShoppingListButton: false
};
