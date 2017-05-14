import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from "enzyme";
import { createStore } from 'redux'
import { Provider } from 'react-redux'
it('renders without crashing', () => {
    const store = createStore(() => ({}));
    shallow(<Provider store={store}><App/></Provider>)
});
