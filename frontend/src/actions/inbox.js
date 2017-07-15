import apiFetch from './index';

export const REQUEST_INBOX = 'REQUEST_INBOX';
export const RECEIVE_INBOX = 'RECEIVE_INBOX';

export function fetchInbox (id,query) {
    return (dispatch, getState) => {
        dispatch(requestInbox(id));
        return apiFetch(`inbox/${id}?query=${query}`)
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
        return apiFetch(`inbox/${inbox_id}/threads`,
            {
                method: 'POST',
            })
            .then((response) => response.json())
            .then((json) => {dispatch(fetchInbox(inbox_id))});
    };
}