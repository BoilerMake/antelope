import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import UserReducer from './reducer_user';
import InboxReducer from './reducer_inbox';
import ThreadReducer from './reducer_thread';
import SystemReducer from './reducer_system';
import SettingsReducer from './reducer_settings';
const rootReducer = combineReducers({
    user: UserReducer,
    inbox: InboxReducer,
    thread: ThreadReducer,
    system: SystemReducer,
    settings: SettingsReducer,
    form: formReducer
});

export default rootReducer