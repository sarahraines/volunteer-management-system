import { combineReducers } from 'redux';

const alerts = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ALERT':
            return state.concat([action])
        case 'REMOVE_ALERT':
            return state.filter(alert => alert.id !== action.id)
        default:
            return state
    }
}

const rootReducer = combineReducers({
    alerts,
});

export default rootReducer;