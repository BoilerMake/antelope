
import {
    RECEIVE_SETTINGS_INBOX,
    REQUEST_SETTINGS_INBOX,
    REQUEST_SETTINGS_USER_EVENTS,
    RECEIVE_SETTINGS_USER_EVENTS,
    REQUEST_SETTINGS_GROUP_INBOX_MATRIX,
    RECEIVE_SETTINGS_GROUP_INBOX_MATRIX,
    RECEIVE_SETTINGS_USERLIST,
    REQUEST_SETTINGS_USER_DETAIL,
    RECEIVE_SETTINGS_USER_DETAIL,
    RECEIVE_SETTINGS_GROUPLIST,
    REQUEST_SETTINGS_GROUP_DETAIL,
    RECEIVE_SETTINGS_GROUP_DETAIL,
    REQUEST_INBOX_DESTINATION_CHECK,
    RECEIVE_INBOX_DESTINATION_CHECK
} from '../actions/settings';

export const INITIAL_STATE = {
    inboxes: [],
    inboxes_loading: false,
    user_events: [],
    user_events_loading: false,
    groupInboxMatrix: {},
    groupInboxMatrix_loading: false,
    groups: [],
    groupDetail: {},
    userList: [],
    userDetail: {},
    inboxDestinationCheck: ''
};

export default function (state = INITIAL_STATE, action) {
    const id = action.id;
    switch (action.type) {
        case REQUEST_SETTINGS_INBOX:
            return { ...state, inboxes_loading: true };
        case RECEIVE_SETTINGS_INBOX:
            //todo: error checking
            return { ...state,
                inboxes_loading: false,
                inboxes: action.json.data
            };
        case REQUEST_INBOX_DESTINATION_CHECK:
            return { ...state, inboxDestinationCheck: 'loading...'};
        case RECEIVE_INBOX_DESTINATION_CHECK:
            return { ...state, inboxDestinationCheck: action.json.data};
        case REQUEST_SETTINGS_USER_EVENTS:
            return { ...state, user_events_loading: true };
        case RECEIVE_SETTINGS_USER_EVENTS:
            //todo: error checking
            return { ...state,
                user_events_loading: false,
                user_events: action.json.data
            };
        case RECEIVE_SETTINGS_GROUPLIST:
            //todo: error checking
            return { ...state,
                groups: action.json.data
            };
        case REQUEST_SETTINGS_GROUP_INBOX_MATRIX:
            return { ...state, groupInboxMatrix_loading: true };
        case RECEIVE_SETTINGS_GROUP_INBOX_MATRIX:
            return {
                ...state,
                groupInboxMatrix: action.json.data,
                groupInboxMatrix_loading: false,

            };
        case RECEIVE_SETTINGS_USERLIST:
            return {
                ...state,
                userList: action.json.data,

            };
        case REQUEST_SETTINGS_USER_DETAIL:
            return {
                ...state,
                userDetail: {
                    ...state.userDetail,
                    [id]: {...state.userDetail[id], isFetching: true, isError: false}
                }

            };
        case RECEIVE_SETTINGS_USER_DETAIL:
            if(action.json.success) {
                return {
                    ...state,
                    userDetail: {
                        ...state.userDetail,
                        [id]: {
                            ...state.userDetail[id],
                            contents: action.json.data,
                            isFetching: false,
                            isError: false,
                            error_message: null
                        }
                    }
                };
            }
            return {
                ...state,
                userDetail: {
                    ...state.userDetail,
                    [id]: {
                        ...state.userDetail[id],
                        isFetching: false,
                        isError: true,
                        error_message: action.json.message
                    }
                }

            };
        case REQUEST_SETTINGS_GROUP_DETAIL:
            return {
                ...state,
                groupDetail: {
                    ...state.groupDetail,
                    [id]: {...state.groupDetail[id], isFetching: true, isError: false}
                }

            };
        case RECEIVE_SETTINGS_GROUP_DETAIL:
            if(action.json.success) {
                return {
                    ...state,
                    groupDetail: {
                        ...state.groupDetail,
                        [id]: {
                            ...state.groupDetail[id],
                            contents: action.json.data,
                            isFetching: false,
                            isError: false,
                            error_message: null
                        }
                    }
                };
            }
            return {
                ...state,
                groupDetail: {
                    ...state.groupDetail,
                    [id]: {
                        ...state.groupDetail[id],
                        isFetching: false,
                        isError: true,
                        error_message: action.json.message
                    }
                }

            };
        default:
            return state;
    }
}