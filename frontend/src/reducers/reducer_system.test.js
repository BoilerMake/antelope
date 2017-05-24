import deepFreeze from 'deep-freeze';
import { assert } from 'chai';
import reducer_system, { INITIAL_STATE as initialState } from './reducer_system.js';

deepFreeze(initialState);

it('handles default action', () => {
    const newState = reducer_system(initialState, {
        type: 'none'
    });
    assert.deepEqual(initialState, newState);
});
it('handles toggling the sidebar', ()=>{
    let newState = reducer_system(initialState, {
        type: 'SYSTEM_TOGGLE_SIDEBAR',
    });
    assert.equal(newState.sidebar,true);
    newState = reducer_system(newState, {
        type: 'SYSTEM_TOGGLE_SIDEBAR',
    });
    assert.equal(newState.sidebar,false);
});
it('handles changing the screen layout', ()=>{
    let newState = reducer_system(initialState, {
        type: 'SYSTEM_UPDATE_SCREEN_WIDTH',
        width: 1500
    });
    assert.equal(newState.layout,'desktop');
    newState = reducer_system(initialState, {
        type: 'SYSTEM_UPDATE_SCREEN_WIDTH',
        width: 700
    });
    assert.equal(newState.layout,'condensed');
    newState = reducer_system(initialState, {
        type: 'SYSTEM_UPDATE_SCREEN_WIDTH',
        width: 200
    });
    assert.equal(newState.layout,'mobile');
});