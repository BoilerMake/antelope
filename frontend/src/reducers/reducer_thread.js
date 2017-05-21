
import {
    RECEIVE_THREAD,
    REQUEST_THREAD,
    RECEIVE_THREAD_ASSIGNMENTS,
    REQUEST_THREAD_ASSIGNMENTS,
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
        case REQUEST_THREAD_ASSIGNMENTS:
            return {
                ...state,
                [id]: {...state[id], isFetchingAssignments: true}
            };
        case RECEIVE_THREAD_ASSIGNMENTS:
            return {
                ...state,
                [id]: {
                    ...state[id],
                    assignments: action.data,
                    isFetchingAssignments: false
                }
            };
        default:
            return state;
    }
}