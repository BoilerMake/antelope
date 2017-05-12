
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
                [id]: {...state[id], isFetching: true}
            };
        case RECEIVE_INBOX:
            //todo: error checking
            return {
                ...state,
                [id]: {
                    ...state[id],
                    contents: action.data,
                    isFetching: true
                }
            };
        default:
            return state;
    }
}