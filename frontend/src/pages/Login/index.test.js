import React from 'react';
import ReactDOM from 'react-dom';
import ConnectedLogin , { Login } from './index';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from "enzyme";
import fetchMock from 'fetch-mock';

import { createStore } from 'redux';
import { Provider } from 'react-redux';


it('calls reducer upon successful API response', async () =>  {

    global.fetch = jest.fn().mockImplementation(() => {
        let p = new Promise((resolve, reject) => {
            resolve({
                // success: false,
                // Id: '123',
                json: function() {
                    return {
                        success: true,
                        data: {token: "mytoken"}
                    }
                }
            });
        });

        return p;
    });

    // fetchMock.post('*', {success: true, data: {token: "aa"}});
    let mockAction = jest.fn();
    const wrapper = shallow(
        <Login
            loginFromJWT={mockAction}
            user={{authenticated: false}}
            location={{state: null}}
        />);

    wrapper.instance().handleSubmit({email: 'test@email.com', password: "hi"}).then(()=>{
        expect(mockAction.mock.calls[0][0]).toBe('mytoken');
    });

    // return expect(wrapper.instance().handleSubmit({email: 'test@email.com', password: "hi"})).resolves;
});
it('handles invalid credentials', async () =>  {

    global.fetch = jest.fn().mockImplementation(() => {
        let p = new Promise((resolve, reject) => {
            resolve({
                // success: false,
                // Id: '123',
                json: function() {
                    return {
                        success: false,
                        message: "bad password"
                    }
                }
            });
        });

        return p;
    });

    // fetchMock.post('*', {success: true, data: {token: "aa"}});
    let mockAction = jest.fn();
    const wrapper = shallow(
        <Login
            loginFromJWT={mockAction}
            user={{authenticated: false}}
            location={{state: null}}
        />);

    wrapper.instance().handleSubmit({email: 'test@email.com', password: "badpw"}).then((a,b)=>{
        console.log(a,b);
        // expect(mockAction.mock.calls[0][0]).toBe('mytoken');
    }).catch((error)=>{
        expect(error.errors._error).toEqual('bad password');
    });

    // return expect(wrapper.instance().handleSubmit({email: 'test@email.com', password: "hi"})).resolves;
});
it('redirects when already logged in', () => {

    const store = createStore(() => ({}));

    const wrapper = mount(
        <MemoryRouter>
        <Provider store={store}>
            <Login
                loginFromJWT={()=>{}}
                user={{authenticated: true}}
                location={{state: null}}
            />
        </Provider>
    </MemoryRouter>);
    expect(wrapper.instance().history.location.pathname).toEqual('/inbox');

})