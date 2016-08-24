import {Map, List } from 'immutable';
import Immutable from 'immutable';

const DEFAULT_STATE = new Map({});

// Actions
const DAY_CHANGE  = 'day/DAY_CHANGE';
const UNMOUNT_DAY = 'day/UNMOUNT_DAY';

export default function dayReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case DAY_CHANGE:
            ret = state.set('currentDay', action.day);
            ret = ret.set('unmountDay', true);
            return ret;

        case UNMOUNT_DAY:
            return state.set('unmountDay', action.val);

        default:
            return state;
    }
}

//Action Creators

export function unmountDay(bval) {
    return {
        type: UNMOUNT_DAY,
        val: bval
    };
}

export function dayChange(day) {
    return {
        type: DAY_CHANGE,
        day: day
    };
}
