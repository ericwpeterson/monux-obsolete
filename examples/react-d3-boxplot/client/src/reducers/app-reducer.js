import {Map, List } from 'immutable';
import Immutable from 'immutable';
import _ from 'underscore';


const DEFAULT_STATE = new Map({currentDataPoint: 'temperatureF'});

export default function appReducer(state = DEFAULT_STATE, action) {
    let ret;
    switch (action.type) {

        case 'DATAPOINT_CHANGE':
            ret = state.set('currentDataPoint', action.dataPoint)
            ret = ret.set('unmountMonth', true);
            return ret;

        //case 'MONTH_CHANGE':
            //ret = state.set('currentMonth', action.month)
            //ret = state.set('unmountWeeks', true);
            //return ret;

        case 'INIT_APP':
            return DEFAULT_STATE;

        case 'UNMOUNT_MONTH':
          return state.set('unmountMonth', action.val)

        //case 'UNMOUNT_WEEKS':
          //return state.set('unmountWeeks', action.val)

        default:
            return state;
    }
}
