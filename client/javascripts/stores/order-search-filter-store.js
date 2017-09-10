import Reflux from 'reflux';
import OrderSearchFilterActions from './../actions/order-search-filter-actions';
import _ from 'lodash';
import moment from 'moment';

class OrderSearchFilterStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = OrderSearchFilterActions;
        this.state = { store: defaultState };
    }

    onSetName(name) {
        const newData = this.state.store;
        newData.name = name && name.length > 0 ? name : '';
        this.setLocaleState(newData);
        OrderSearchFilterActions.filter.completed(newData);
    }

    onSetState(state) {
        const newData = this.state.store;
        newData.state = state && state.length > 0 ? state : '';
        this.setLocaleState(newData);
        OrderSearchFilterActions.filter.completed(newData);
    }

    onSetFromDeliveryDate(fromMoment) {
        const newData = this.state.store;
        newData.deliveryDate.from = fromMoment;
        this.setLocaleState(newData);
        OrderSearchFilterActions.filter.completed(newData);
    }

    onSetToDeliveryDate(toMoment) {
        const newData = this.state.store;
        newData.deliveryDate.to = toMoment;
        this.setLocaleState(newData);
        OrderSearchFilterActions.filter.completed(newData);
    }

    setLocaleState(data) {
        this.setState({ store: data });
    }
}

const defaultState = {
    name: '',
    state: '',
    deliveryDate: {
        from: moment().subtract(1, 'month'),
        to: moment().add(3, 'month')
    }
};

export function buildStore() {
    return new OrderSearchFilterStore();
}
