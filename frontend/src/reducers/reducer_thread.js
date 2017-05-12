
import {
    RECEIVE_THREAD,
    REQUEST_THREAD,
} from '../actions/thread';

export const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
    let id = action.id;
    switch (action.type) {
        case REQUEST_THREAD:
            return {
                ...state,
                [id]: {...state[id], isFetching: true}
            };
        case RECEIVE_THREAD:
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