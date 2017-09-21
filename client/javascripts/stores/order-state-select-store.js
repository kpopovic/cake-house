import Reflux from 'reflux';
import OrderStateSelectActions from './../actions/order-state-select-actions';
import OrderModalActions from './../actions/order-modal-actions';

class OrderStateSelectStore extends Reflux.Store {

    constructor(initialState) {
        super(initialState);
        this.listenables = [OrderStateSelectActions, OrderModalActions];
        this.state = { initialState: initialState, currentState: initialState };
    }

    onSetState(state) {
        this.setState({ currentState: state });
        OrderStateSelectActions.setState.completed(state);
    }

    onResetStore() {
        this.setState({ currentState: this.state.initialState });
    }
}

export function buildStore(initialState) {
    return new OrderStateSelectStore(initialState);
}
