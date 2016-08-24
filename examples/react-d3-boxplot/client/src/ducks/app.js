import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';

const DEFAULT_STATE = new Map({currentDataPoint: 'temperatureF'});

export default function appReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case 'DATAPOINT_CHANGE':
            ret = state.set('currentDataPoint', action.dataPoint);
            ret = ret.set('unmountMonth', true);
            return ret;

        case 'INIT_APP':
            return DEFAULT_STATE;

        case 'UNMOUNT_MONTH':
            return state.set('unmountMonth', action.val);

        default:
            return state;
    }
}

//Action Creators

export function dataPointChange(dataPoint) {
    return {
        type: 'DATAPOINT_CHANGE',
        dataPoint: dataPoint
    };
}

export function unmountMonth(bval) {
    return {
        type: 'UNMOUNT_MONTH',
        val: bval
    };
}
