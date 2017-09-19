import Reflux from 'reflux';
import OrderStateSelectActions from './../actions/order-state-select-actions';

class OrderStateSelectStore extends Reflux.Store {

    constructor(initialState) {
        super(initialState);
        this.listenables = OrderStateSelectActions;
        this.state = { initial: initialState, checked: initialState };
    }

    onSetState(state) {
        this.setState({ checked: state });
        OrderStateSelectActions.setState.completed(state);
    }
}

export function buildStore(initialState) {
    return new OrderStateSelectStore(initialState);
}
