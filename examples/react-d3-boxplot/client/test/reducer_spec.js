
import {List, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/ducks/index';
import {stats, hydratedStats, appStateAfterHydration,
    appStateAfterChangingDataPointToCO2, appStateAfterMonthChange,
    appStateAfterWeekChange, appStateAfterDayChange,
    appStateAfterDataPointChangedForAllGraphs } from './test_data';

import {opCompleted} from '../src/ducks/monobject';
import {dataPointChange, monthChange,
    dayChange, weekChange} from '../src/ducks/boxplots';


let initState = () => {
    let payload = {
        monObject: 'stats',
        op: 'Get::stats',
        value: stats
    };
    let action = opCompleted(payload);
    let state;

    return reducer(state, action);
}

describe('reducer', () => {

    it('hydrates the stats into the app and monobject reducers', () => {
        let nextState = initState();
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterHydration);
        expect(stats).to.deep.equal(nextState.monobjectReducer.toJS().monobjects.stats.props.stats.value);
    });

    it('sets chart data for all charts when the datapoint changes', () => {
        let nextState = initState();
        let action = dataPointChange('cO2Level');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterChangingDataPointToCO2);
    });

    it('sets chart data for weeks when a month is selected', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterMonthChange);
    });

    it('sets chart data for days when a week is selected', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterWeekChange);
    });


    it('sets chart data for a day when a day is selected and updates all graphs for when the datapoint changes', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        action = dayChange('2016-07-26');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterDayChange);
        action = dataPointChange('cO2Level');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS()).to.deep.equal(appStateAfterDataPointChangedForAllGraphs);
    });
});
