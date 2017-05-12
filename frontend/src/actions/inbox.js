import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';

export const REQUEST_INBOX = 'REQUEST_INBOX';
export const RECEIVE_INBOX = 'RECEIVE_INBOX';

export function fetchInbox (id) {
    return (dispatch, getState) => {
        dispatch(requestInbox(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/inbox/${id}?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveInbox(json,id)));
    };
}

function requestInbox (id) {
    return {
        type: REQUEST_INBOX,
        id
    };
}

function receiveInbox (json,id) {
    //todo: good errors
    // if ('error' in json) {
    //     json = null;
    // }
    return {
        type: RECEIVE_INBOX,
        data: json.data,
        id,
        receivedAt: Date.now()
    };
}