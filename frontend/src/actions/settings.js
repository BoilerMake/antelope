import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';
import {toastr} from 'react-redux-toastr'
export const REQUEST_SETTINGS_INBOX = 'REQUEST_SETTINGS_INBOX';
export const RECEIVE_SETTINGS_INBOX = 'RECEIVE_SETTINGS_INBOX';

export function fetchSettingsInboxes () {
    return (dispatch) => {
        dispatch(requestSettingsInbox());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/inboxes?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveSettingsInbox(json)));
    };
}

function requestSettingsInbox () {
    return {
        type: REQUEST_SETTINGS_INBOX
    };
}

function receiveSettingsInbox (json) {
    return {
        type: RECEIVE_SETTINGS_INBOX,
        json: json
    };
}

export function putSettingsInboxes(inboxes) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/inboxes?token=${token}`,
            {
                method: 'PUT',
                body: JSON.stringify(inboxes)
            })
            .then((response) => response.json())
            .then((json) => {
                if(json.success)
                    toastr.success('Success!', 'Inbox settings updated');
                dispatch(fetchSettingsInboxes())
            });
    };
}

export const REQUEST_SETTINGS_USER_EVENTS = 'REQUEST_SETTINGS_USER_EVENTS';
export const RECEIVE_SETTINGS_USER_EVENTS = 'RECEIVE_SETTINGS_USER_EVENTS';

export function fetchSettingsUserEvents () {
    return (dispatch) => {
        dispatch(requestSettingsUserEvents());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/userevents?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveSettingsUserEvents(json)));
    };
}

function requestSettingsUserEvents () {
    return {
        type: REQUEST_SETTINGS_USER_EVENTS
    };
}

function receiveSettingsUserEvents (json) {
    return {
        type: RECEIVE_SETTINGS_USER_EVENTS,
        json
    };
}

export const REQUEST_SETTINGS_GROUP_INBOX_MATRIX = 'REQUEST_SETTINGS_GROUP_INBOX_MATRIX';
export const RECEIVE_SETTINGS_GROUP_INBOX_MATRIX = 'RECEIVE_SETTINGS_GROUP_INBOX_MATRIX';
export function fetchSettingsGroupInboxMatrix () {
    return (dispatch) => {
        dispatch(requestSettingsGroupInboxMatrix());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groupinboxmatrix?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveSettingsGroupInboxMatrix(json)));
    };
}

function requestSettingsGroupInboxMatrix () {
    return {
        type: REQUEST_SETTINGS_GROUP_INBOX_MATRIX
    };
}

function receiveSettingsGroupInboxMatrix (json) {
    return {
        type: RECEIVE_SETTINGS_GROUP_INBOX_MATRIX,
        json
    };
}

export function putSettingsGroupInboxMatrix(matrix) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groupinboxmatrix?token=${token}`,
            {
                method: 'PUT',
                body: JSON.stringify(matrix)
            })
            .then((response) => response.json())
            .then((json) => {
                json.data.forEach(i=>toastr.success('Success!', i));
                dispatch(fetchSettingsGroupInboxMatrix())
        });
    };
}


export function createGroup(name) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groups?name=${name}&token=${token}`,
            {
                method: 'POST'
            })
            .then((response) => response.json())
            .then((json) => {
                if(json.success)
                    toastr.success('Group Created!', `#${json.data.id}`);
                dispatch(fetchSettingsGroupInboxMatrix())
        });
    };
}


export const REQUEST_SETTINGS_USERLIST = 'REQUEST_SETTINGS_USERLIST';
export const RECEIVE_SETTINGS_USERLIST = 'RECEIVE_SETTINGS_USERLIST';
export function fetchUserList () {
    return (dispatch) => {
        dispatch(requestUserList());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/users?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveUserList(json)));
    };
}

function requestUserList () {
    return {
        type: REQUEST_SETTINGS_USERLIST
    };
}

function receiveUserList (json) {
    return {
        type: RECEIVE_SETTINGS_USERLIST,
        json
    };
}
export function createUser(email) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/users?email=${email}&token=${token}`,
            {
                method: 'POST'
            })
            .then((response) => response.json())
            .then((json) => {
            if(json.success)
                toastr.success('User Created!', `#${json.data.id}`);
            else
                toastr.error('Error',json.message);
            dispatch(fetchUserList())
        });
    };
}


export const REQUEST_SETTINGS_USER_DETAIL = 'REQUEST_SETTINGS_USER_DETAIL';
export const RECEIVE_SETTINGS_USER_DETAIL = 'RECEIVE_SETTINGS_USER_DETAIL';

export function fetchSettingsUser (id) {
    return (dispatch, getState) => {
        dispatch(requestSettingsUser(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/users/${id}?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveSettingsUser(json,id)));
    };
}

function requestSettingsUser (id) {
    return {
        type: REQUEST_SETTINGS_USER_DETAIL,
        id
    };
}

function receiveSettingsUser (json,id) {
    return {
        type: RECEIVE_SETTINGS_USER_DETAIL,
        json,
        id,
        receivedAt: Date.now()
    };
}

export function putSetttingsUser(user) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/users/${user.id}?token=${token}`,
            {
                method: 'PUT',
                body: JSON.stringify(user)
            })
            .then((response) => response.json())
            .then((json) => {
                toastr.success('Success!', 'User Updated');
                dispatch(fetchSettingsUser(user.id))
            });
    };
}