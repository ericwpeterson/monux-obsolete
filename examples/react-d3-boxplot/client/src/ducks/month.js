import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';

const DEFAULT_STATE = new Map({});

export default function monthReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case 'MONTH_CHANGE':
            ret = state.set('currentMonth', action.month);
            ret = ret.set('unmountWeeks', true);
            return ret;

        case 'INIT_MONTH':
            return DEFAULT_STATE;

        case 'UNMOUNT_WEEKS':
            return state.set('unmountWeeks', action.val);

        default:
            return state;
    }
}

//Action Creators

export function unmountWeeks(bval) {
    return {
        type: 'UNMOUNT_WEEKS',
        val: bval
    };
}

export function monthChange(month) {
    return {
        type: 'MONTH_CHANGE',
        month: month
    };
}
