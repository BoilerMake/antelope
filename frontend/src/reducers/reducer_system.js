
import {
    SYSTEM_TOGGLE_SIDEBAR,
    SYSTEM_UPDATE_SCREEN_WIDTH
} from '../actions/system';

export const INITIAL_STATE = {
    layout: 'mobile',
    sidebar: false,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SYSTEM_TOGGLE_SIDEBAR:
            return { ...state, sidebar: !state.sidebar };
        case SYSTEM_UPDATE_SCREEN_WIDTH:
            let layout = 'desktop';
            if(action.width <= 500)
                layout = 'mobile';
            else if(action.width <= 800)
                layout = 'condensed';
            return {...state, layout};
        default:
            return state;
    }
}