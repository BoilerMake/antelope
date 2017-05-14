import * as ActionTypes from '../actions'
// import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
    const { type, error } = action

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return error
    }

    return state
}
import { reducer as formReducer } from 'redux-form'
import UserReducer from './reducer_user';
import InboxReducer from './reducer_inbox';
import ThreadReducer from './reducer_thread';
import SystemReducer from './reducer_system';
const rootReducer = combineReducers({
    user: UserReducer,
    inbox: InboxReducer,
    thread: ThreadReducer,
    system: SystemReducer,
    errorMessage,
    form: formReducer
    // routing
})

export default rootReducer