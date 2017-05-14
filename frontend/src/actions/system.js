
export const SYSTEM_TOGGLE_SIDEBAR = 'SYSTEM_TOGGLE_SIDEBAR';
export const SYSTEM_UPDATE_SCREEN_WIDTH = 'SYSTEM_UPDATE_SCREEN_WIDTH';

export function toggleSidebar () {
    return {
        type: SYSTEM_TOGGLE_SIDEBAR
    };
}

export function updateScreenWidth(width) {
    return {
        type: SYSTEM_UPDATE_SCREEN_WIDTH,
        width
    };
}