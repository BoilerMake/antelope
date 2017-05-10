
import {
    LOGIN_FROM_JWT_SUCCESS,
    RECEIVE_ME,
    REQUEST_ME,
    // REQUEST_USER_INBOX_LIST,
    RECEIVE_USER_INBOX_LIST,
    LOGOUT_USER
} from '../actions/users';

import jwtDecode from 'jwt-decode';

const INITIAL_STATE = {
    authenticated: false,
    me: null,
    error: null,
    loading: false,
    token_data: null,
    token: null,
    inbox_list: []
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {

        case LOGIN_FROM_JWT_SUCCESS:
            return { ...state,
                authenticated: true,
                error: null,
                loading: false,
                token_data: jwtDecode(action.token),
                token: action.token
            };
        case LOGOUT_USER:
            return INITIAL_STATE;
        case REQUEST_ME:
            return { ...state, loading: true };
        case RECEIVE_ME:
            //todo: error checking
            return { ...state,
                loading: false,
                me: action.me.data
            };
        case RECEIVE_USER_INBOX_LIST:
            return { ...state,
                inbox_list: action.data.data
            };

        default:
            return state;
    }
}