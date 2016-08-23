import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';

const DEFAULT_STATE = new Map({});

export default function monthReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case 'MONTH_CHANGE':
            ret = state.set('currentMonth', action.month)
            ret = state.set('unmountWeeks', true);
            return ret;

        case 'INIT_MONTH':
            return DEFAULT_STATE;

        case 'UNMOUNT_WEEKS':
          return state.set('unmountWeeks', action.val)

        default:
            return state;
    }
}
