import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';

export const REQUEST_INBOX = 'REQUEST_INBOX';
export const RECEIVE_INBOX = 'RECEIVE_INBOX';

export function fetchInbox (id,query) {
    return (dispatch, getState) => {
        dispatch(requestInbox(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/inbox/${id}?query=${query}&token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveInbox(json,id)));
    };
}

function requestInbox (id,query) {
    return {
        type: REQUEST_INBOX,
        query,
        id
    };
}

function receiveInbox (json,id,query) {
    return {
        type: RECEIVE_INBOX,
        query,
        json,
        id,
        receivedAt: Date.now()
    };
}

export function createThread(inbox_id) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/inbox/${inbox_id}/threads?token=${token}`,
            {
                method: 'POST',
            })
            .then((response) => response.json())
            .then((json) => {dispatch(fetchInbox(inbox_id))});
    };
}