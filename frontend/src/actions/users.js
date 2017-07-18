import cookie from 'react-cookie';
import apiFetch from './index';
import {toastr} from 'react-redux-toastr'

export const LOGIN_FROM_JWT_SUCCESS = 'LOGIN_FROM_JWT_SUCCESS';
export function loginFromJWT (token) {
	cookie.save('token',token, {path: '/'});
    return (dispatch) => {
        dispatch(saveToken(token));
        setTimeout(() => { dispatch(fetchMe()); }, 50);
    }
}

function saveToken(token) {
    return {
        type: LOGIN_FROM_JWT_SUCCESS,
        token: token
    };
}
export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser() {
    return function (dispatch) {
        dispatch({ type: LOGOUT_USER });
        cookie.remove('token', { path: '/' });
    }
}


export const REQUEST_ME = 'REQUEST_ME';
export const RECEIVE_ME = 'RECEIVE_ME';

export function fetchMe () {
    return (dispatch, getState) => {
        dispatch(requestMe());
        return apiFetch('users/me')
            .then((response) => response.json())
            .then((json) => {dispatch(receiveMe(json))});
    };
}

function requestMe () {
    return {
        type: REQUEST_ME
    };
}

function receiveMe (json) {
    let {success} = json;
    return {
        type: RECEIVE_ME,
        me: json,
        success
    };
}

export const REQUEST_USER_INBOX_LIST = 'REQUEST_USER_INBOX_LIST';
export const RECEIVE_USER_INBOX_LIST = 'RECEIVE_USER_INBOX_LIST';

export function fetchUserInboxList () {
    return (dispatch, getState) => {
        dispatch(requestUserInboxList());
        return apiFetch('users/me/inboxes')
            .then((response) => response.json())
            .then((json) => dispatch(receiveUserInboxList(json)));
    };
}

function requestUserInboxList () {
    return {
        type: REQUEST_USER_INBOX_LIST
    };
}

function receiveUserInboxList (json) {
    let {success} = json;
    return {
        type: RECEIVE_USER_INBOX_LIST,
        data: json,
        success
    };
}

export function updateMe(me) {
    return (dispatch) => {
        return apiFetch('users/me',
            {
                method: 'PUT',
                body: JSON.stringify(me)
            })
            .then((response) => response.json())
            .then((json) => {
                toastr.success('Success!', 'Your information has been updated');
                dispatch(fetchMe())
            });
    };
}
