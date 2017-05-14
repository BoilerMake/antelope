
import {
    SYSTEM_TOGGLE_SIDEBAR,
    SYSTEM_UPDATE_SCREEN_WIDTH
} from '../actions/system';

export const INITIAL_STATE = {
    mobile: true,
    sidebar: false,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SYSTEM_TOGGLE_SIDEBAR:
            return { ...state, sidebar: !state.sidebar }
        case SYSTEM_UPDATE_SCREEN_WIDTH:
            return { ...state, mobile: (action.width <= 500) };
        default:
            return state;
    }
}