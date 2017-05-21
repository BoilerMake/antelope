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
    return {
        type: RECEIVE_THREAD,
        json,
        id,
        receivedAt: Date.now()
    };
}

export const REQUEST_THREAD_ASSIGNMENTS = 'REQUEST_THREAD_ASSIGNMENTS';
export const RECEIVE_THREAD_ASSIGNMENTS = 'RECEIVE_THREAD_ASSIGNMENTS';

export function fetchThreadAssignments (id) {
    return (dispatch) => {
        if(id===null) return;
        dispatch(requestThreadAssignments(id));
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/thread/${id}/assignments?token=${token}`)
            .then((response) => response.json())
            .then((json) => dispatch(receiveThreadAssignments(json,id)));
    };
}

function requestThreadAssignments (id) {
    return {
        type: REQUEST_THREAD_ASSIGNMENTS,
        id
    };
}

function receiveThreadAssignments (json,id) {
    //todo: good errors
    // if ('error' in json) {
    //     json = null;
    // }
    return {
        type: RECEIVE_THREAD_ASSIGNMENTS,
        data: json.data,
        id,
        receivedAt: Date.now()
    };
}
export function updateThreadAssignments(id,assignments) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/thread/${id}/assignments?token=${token}`,
            {
                method: 'PUT',
                body: JSON.stringify(assignments)
            })
            .then((response) => response.json())
            .then((json) => {dispatch(fetchThreadAssignments(id)); dispatch(fetchThread(id))});
    };
}


export function createDraft(thread_id,mode) {
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/thread/${thread_id}/drafts?token=${token}`,
            {
                method: 'POST',
                body: JSON.stringify(mode)
            })
            .then((response) => response.json())
            .then((json) => {dispatch(fetchThread(thread_id))});
    };
}
export function updateDraft(draft,action) {
    //todo: errors
    return (dispatch) => {
        const token = cookie.load('token');
        return fetch(`${API_BASE_URL}/drafts/${draft.id}?token=${token}&action=${action}`,
            {
                method: 'PUT',
                body: JSON.stringify(draft)
            })
            .then((response) => response.json())
            .then((json) => {dispatch(fetchThread(draft.thread_id))});
    };
}
