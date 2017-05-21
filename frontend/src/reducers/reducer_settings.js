
import {
    RECEIVE_SETTINGS_INBOX,
    REQUEST_SETTINGS_INBOX
} from '../actions/settings';

export const INITIAL_STATE = {
    inboxes: [],
    inboxes_loading: false,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case REQUEST_SETTINGS_INBOX:
            return { ...state, inboxes_loading: true };
        case RECEIVE_SETTINGS_INBOX:
            //todo: error checking
            return { ...state,
                inboxes_loading: false,
                inboxes: action.json.data
            };
        default:
            return state;
    }
}