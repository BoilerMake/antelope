import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';

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
            .then((json) => dispatch(fetchSettingsInboxes()));
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
            .then((json) => dispatch(fetchSettingsGroupInboxMatrix()));
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
            .then((json) => dispatch(fetchSettingsGroupInboxMatrix()));
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