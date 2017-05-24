import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux'
// import  SettingsPageUsers from './SettingsPageUsers';
import  {SettingsPageUsers} from './SettingsPageUsers';
import { shallow, mount} from "enzyme";
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { reduxForm, reducer as form } from 'redux-form'

describe('<LoginForm/>', () => {
    it('renders without crashing', () => {
        const w = mount(<SettingsPageUsers fetchMe={()=>null}
                                              fetchUserList={()=>null}
                                              user={{me: {is_admin: true}}}
                                              settings={{userList: [
                                                  {
                                                      id:1,
                                                      last_name: 'bob',
                                                      groups: [{name: "group1"}],
                                                  }
                                                  ]}}/>);
        expect(w.contains(<h1 className="settingsHeaderText">Users</h1>)).toEqual(true);
    });
    it('does not allow non-admin', () => {
        const w = mount(<SettingsPageUsers fetchMe={()=>null}
                                           fetchUserList={()=>null}
                                           user={{me: {is_admin: false}}}
                                           settings={{userList: [
                                               {
                                                   id:1,
                                                   last_name: 'bob',
                                                   groups: [{name: "group1"}],
                                               }
                                           ]}}/>);
        expect(w.contains(<h1 className="settingsHeaderText">Users: Permission denied</h1>)).toEqual(true);
    });
    // test('aa', () => {
    //     const store = createStore(() => ({}),{user: {me: null}});
    //
    //     // const Decorated = reduxForm({ form: 'testForm' })(MyForm)
    //     const tree = renderer.create(
    //         <Provider store={store}>
    //             <SettingsPageUsers />
    //         </Provider>
    //     )
    // })
});

