import Reflux from 'reflux';
import OrderStateSelectActions from './../actions/order-state-select-actions';
import OrderModalActions from './../actions/order-modal-actions';

class OrderStateSelectStore extends Reflux.Store {

    constructor(initialState) {
        super(initialState);
        this.listenables = [OrderStateSelectActions, OrderModalActions];
        this.state = { store: { initialState: initialState, currentState: initialState } };
    }

    onSetState(state) {
        const newState = Object.assign({}, this.state.store, { currentState: state });
        this.setLocalState(newState);
        OrderStateSelectActions.setState.completed(newState);
    }

    onResetStore() {
        const state = { initialState: this.state.initialState, currentState: this.state.initialState };
        this.setLocalState(state);
    }

    setLocalState(data) {
        this.setState({ store: data });
    }
}

export function buildStore(initialState) {
    return new OrderStateSelectStore(initialState);
}
