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