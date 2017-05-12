import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux'
import LoginForm from './LoginForm';
import { shallow, mount } from "enzyme";
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { reduxForm, reducer as form } from 'redux-form'

describe('<LoginForm/>', () => {
    it('renders without crashing', () => {
        shallow(<LoginForm/>);
    });
    test('aa', () => {
        const store = createStore(
            combineReducers({ form }),
            { form: {} }
        );

        // const Decorated = reduxForm({ form: 'testForm' })(MyForm)
        const tree = renderer.create(
            <Provider store={store}>
                <LoginForm />
            </Provider>
        )
    })
});

