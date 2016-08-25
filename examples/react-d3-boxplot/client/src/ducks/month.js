import {Map, List } from 'immutable';
import Immutable from 'immutable';

const DEFAULT_STATE = new Map({});

// Actions
const MONTH_CHANGE  = 'month/MONTH_CHANGE';
const UNMOUNT_WEEKS = 'month/UNMOUNT_WEEKS';

export default function monthReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case MONTH_CHANGE:
            ret = state.set('currentMonth', action.month);
            ret = ret.set('unmountWeeks', true);
            return ret;

        case UNMOUNT_WEEKS:
            return state.set('unmountWeeks', action.val);

        default:
            return state;
    }
}

//Action Creators

export function unmountWeeks(bval) {
    return {
        type: UNMOUNT_WEEKS,
        val: bval
    };
}

export function monthChange(month) {
    return {
        type: MONTH_CHANGE,
        month: month
    };
}