
import {
    RECEIVE_INBOX,
    REQUEST_INBOX,
} from '../actions/inbox';

export const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
    let id = action.id;
    switch (action.type) {
        case REQUEST_INBOX:
            return {
                ...state,
                [id]: {...state[id], isFetching: true, isError: false}
            };
        case RECEIVE_INBOX:
            if(action.json.success) {
                return {
                    ...state,
                    [id]: {
                        ...state[id],
                        contents: action.json.data,
                        isFetching: false,
                        isError: false,
                        error_message: null
                    }
                };
            }
            return {
                ...state,
                [id]: {
                    ...state[id],
                    isFetching: false,
                    isError: true,
                    error_message: action.json.message
                }
            };
        default:
            return state;
    }
}