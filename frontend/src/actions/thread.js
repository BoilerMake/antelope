import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';

export const REQUEST_THREAD = 'REQUEST_THREAD';
export const RECEIVE_THREAD = 'RECEIVE_THREAD';

export function fetchThread (id) {
    return (dispatch, getState) => {
        if(id===null) return;
        dispatch(requestThread(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/thread/${id}?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveThread(json,id)));
    };
}

function requestThread (id) {
    return {
        type: REQUEST_THREAD,
        id
    };
}

function receiveThread (json,id) {
    //todo: good errors
    // if ('error' in json) {
    //     json = null;
    // }
    return {
        type: RECEIVE_THREAD,
        data: json.data,
        id,
        receivedAt: Date.now()
    };
}