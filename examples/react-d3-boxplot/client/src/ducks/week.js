import {Map, List } from 'immutable';
import Immutable from 'immutable';

const DEFAULT_STATE = new Map({});

// Actions
const WEEK_CHANGE  = 'week/WEEK_CHANGE';
const UNMOUNT_DAYS = 'week/UNMOUNT_DAYS';

export default function weekReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case WEEK_CHANGE:
            ret = state.set('currentWeek', action.week);
            ret = ret.set('unmountDays', true);
            return ret;

        case UNMOUNT_DAYS:
            return state.set('unmountDays', action.val);

        default:
            return state;
    }
}

//Action Creators

export function unmountDays(bval) {
    return {
        type: UNMOUNT_DAYS,
        val: bval
    };
}

export function weekChange(week) {
    return {
        type: WEEK_CHANGE,
        week: week
    };
}
