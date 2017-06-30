import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';
import {toastr} from 'react-redux-toastr'
export const REQUEST_SETTINGS_INBOX = 'REQUEST_SETTINGS_INBOX';
export const RECEIVE_SETTINGS_INBOX = 'RECEIVE_SETTINGS_INBOX';


/**
 *  GET and PUT settings/inboxes
 **/
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


export const REQUEST_INBOX_DESTINATION_CHECK = 'REQUEST_INBOX_DESTINATION_CHECK';
export const RECEIVE_INBOX_DESTINATION_CHECK = 'RECEIVE_INBOX_DESTINATION_CHECK';
export function fetchInboxDestinationCheck (email) {
    return (dispatch) => {
        dispatch(requestInboxDestinationCheck());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/destinationCheck?email=${email}&token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveInboxDestinationCheck(json)));
    };
}

function requestInboxDestinationCheck () {
    return {
        type: REQUEST_INBOX_DESTINATION_CHECK
    };
}

function receiveInboxDestinationCheck (json) {
    return {
        type: RECEIVE_INBOX_DESTINATION_CHECK,
        json
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
/**
 *  GET settings/userevents
 **/


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

/**
 *  GET and PUT settings/groupinboxmatrix
 **/

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



/**
 *  GET and POST settings/groups
 **/

export const REQUEST_SETTINGS_GROUPLIST = 'REQUEST_SETTINGS_GROUPLIST';
export const RECEIVE_SETTINGS_GROUPLIST = 'RECEIVE_SETTINGS_GROUPLIST';
export function fetchGroupList () {
    return (dispatch) => {
        dispatch(requestGroupList());
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groups?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveGroupList(json)));
    };
}

function requestGroupList () {
    return {
        type: REQUEST_SETTINGS_GROUPLIST
    };
}

function receiveGroupList (json) {
    return {
        type: RECEIVE_SETTINGS_GROUPLIST,
        json
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
                dispatch(fetchSettingsGroupInboxMatrix());
                dispatch(fetchGroupList());
        });
    };
}



/**
 *  GET settings/groups/:id
 **/

export const REQUEST_SETTINGS_GROUP_DETAIL = 'REQUEST_SETTINGS_GROUP_DETAIL';
export const RECEIVE_SETTINGS_GROUP_DETAIL = 'RECEIVE_SETTINGS_GROUP_DETAIL';

export function fetchSettingsGroup (id) {
    return (dispatch, getState) => {
        dispatch(requestSettingsGroup(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groups/${id}?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveSettingsGroup(json,id)));
    };
}

function requestSettingsGroup (id) {
    return {
        type: REQUEST_SETTINGS_GROUP_DETAIL,
        id
    };
}

function receiveSettingsGroup (json,id) {
    return {
        type: RECEIVE_SETTINGS_GROUP_DETAIL,
        json,
        id
    };
}

/**
 *  PUT settings/groups/:id
 **/

export function putSetttingsGroup(group) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groups/${group.id}?token=${token}`,
            {
                method: 'PUT',
                body: JSON.stringify(group)
            })
            .then((response) => response.json())
            .then((json) => {
                toastr.success('Success!', 'Group Updated');
                dispatch(fetchSettingsGroup(group.id))
            });
    };
}
export function changeGroupUserMembership(groupId, userId, action) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/settings/groups/${groupId}/users/${userId}?action=${action}&token=${token}`,
            {
                method: 'PUT'
            })
            .then((response) => response.json())
            .then((json) => {
                toastr.success('Success!', json.data);
                dispatch(fetchSettingsGroup(groupId))
            });
    };
}


/**
 *  GET settings/users
 **/


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
/**
 *  POST settings/users
 **/

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

/**
 *  GET settings/users/:id
 **/

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

/**
 *  PUT settings/users/:id
 **/

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