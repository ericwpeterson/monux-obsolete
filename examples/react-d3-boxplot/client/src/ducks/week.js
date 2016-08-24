import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';

const DEFAULT_STATE = new Map({});

export default function weekReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case 'WEEK_CHANGE':
            ret = state.set('currentWeek', action.week);
            ret = ret.set('unmountDays', true);
            return ret;

        case 'INIT_WEEKS':
            return DEFAULT_STATE;

        case 'UNMOUNT_DAYS':
            return state.set('unmountDays', action.val);

        default:
            return state;
    }
}

//Action Creators

export function unmountDays(bval) {
    return {
        type: 'UNMOUNT_DAYS',
        val: bval
    };
}

export function weekChange(week) {
    return {
        type: 'WEEK_CHANGE',
        week: week
    };
}
