import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';

export const REQUEST = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

const DEFAULT_STATE = Map({});

export default function monobjectReducer(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case 'OP_COMPLETED':
            return opCompleted(state, action.payload);

        case 'OP_STARTED':
            return opStarted(state, action.payload);

        case 'INIT':
            return DEFAULT_STATE;

        default:
            return state;
    }
}

function opStarted(state, action) {

    let currentValue;
    let ret;

    if (action.payload.message === 'Call') {

        currentValue = state.getIn(  [
                            'monobjects',
                            action.payload.data.monObject,
                            'methods',
                            action.payload.data.method,
                            'value'	]);
        if (currentValue) {
            ret = state.setIn( [
                            'monobjects',
                            action.payload.data.monObject,
                            'methods',
                            action.payload.data.method
                        ],
                        Map({value: currentValue, state: REQUEST.IN_PROGRESS}));
        } else {
            ret = state.setIn([
                            'monobjects',
                            action.payload.data.monObject,
                            'methods',
                            action.payload.data.method
                        ],
                        Map({state: REQUEST.IN_PROGRESS}));
        }

    } else {
        currentValue = state.getIn( [
                            'monobjects',
                            action.payload.data.monObject,
                            'props',
                            action.payload.data.property,
                            'value'
			            ]);
        if (currentValue) {
            ret = state.setIn([
                            'monobjects',
                            action.payload.data.monObject,
                            'props',
                            action.payload.data.property
                        ],
                        Map({value: currentValue, state: REQUEST.IN_PROGRESS}));
        } else {
            ret = state.setIn([
                            'monobjects',
                            action.payload.data.monObject,
                            'props',
                            action.payload.data.property
                        ],
                        Map({state: REQUEST.IN_PROGRESS}));
        }
    }

    return ret;
}

function opCompleted(state, payload) {

    let tokens = payload.op.split('::');
    let cmd = tokens[0];
    let arg = tokens[1]; //may be a property or method name
    let method;
    let prop;
    let key;

    if (cmd === 'Call') {
        key = 'methods';
    } else {
        key = 'props';
    }

    let ret = state;

    if (payload.error) {
        ret = state.setIn(['monobjects', payload.monObject, key, arg, 'state'], REQUEST.ERROR);
    } else {
        if (cmd === "Get" || cmd === 'Set' || cmd === 'Call' ||  (cmd === 'Watch' && payload.value)) {
            ret = state.setIn(['monobjects', payload.monObject, key, arg],
            Map({value: payload.value, state: REQUEST.COMPLETED}));
        } else if (cmd === 'UnWatch' || cmd === 'Watch') {
            //preserve the value
            let currentValue = state.getIn(['monobjects', payload.monObject, key, arg, 'value']);

            ret = state.setIn(['monobjects', payload.monObject, 'props', arg],
                Map({value: currentValue, state: REQUEST.COMPLETED}));
        }
    }

    return ret;
}
