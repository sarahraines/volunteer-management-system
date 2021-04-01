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

const orgs = (state = [], action) => {
    switch (action.type) {
        case 'SET_ORGS':
            return action?.orgs ?? state;
        default:
            return state
    }
}

const sidebar_item = (state = 'loading', action) => {
    switch (action.type) {
        case 'SET_SIDEBAR':
            return action?.sidebar_item ?? state;
        default:
            return state
    }
}

const rootReducer = combineReducers({
    alerts,
    orgs,
    sidebar_item,
});

export default rootReducer;