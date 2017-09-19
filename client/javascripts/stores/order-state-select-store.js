import Reflux from 'reflux';
import OrderStateSelectActions from './../actions/order-state-select-actions';

class OrderStateSelectStore extends Reflux.Store {

    constructor(initialState) {
        super(initialState);
        this.listenables = OrderStateSelectActions;
        this.state = { initialState: initialState, currentState: initialState };
    }

    onSetState(state) {
        this.setState({ currentState: state });
        OrderStateSelectActions.setState.completed(state);
    }
}

export function buildStore(initialState) {
    return new OrderStateSelectStore(initialState);
}
