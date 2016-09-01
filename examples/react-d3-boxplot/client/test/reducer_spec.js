
import {List, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/ducks/index';

import {stats, hydratedStats, monthStateAfterHydration,
    monthStateAfterChangingDataPointToCO2, weekStateAfterMonthChange,
    daysStateAfterWeekChange, daysStateAfterDayChange,
    monthStateAfterDataPointChangeAndCurrent,
    weekStateAfterDataPointChangeAndCurrent,
    dayStateAfterDataPointChangeAndCurrent,
    monthStateAfterYearChange } from './test_data';

import {opCompleted} from '../src/ducks/monobject';

import {dataPointChange, monthChange, dayChange, weekChange,
     yearChange} from '../src/ducks/boxplots';

let initState = () => {
    let payload = {
        monObject: 'stats',
        op: 'Get::stats',
        value: stats
    };
    let action = opCompleted(payload);
    let state;

    return reducer(state, action);
};

describe('reducer', () => {

    it('hydrates the stats into the app and monobject reducers', () => {
        let nextState = initState();
        expect(nextState.app.toJS().months).to.deep.equal(monthStateAfterHydration);
        //expect(stats).to.deep.equal(nextState.monobjectReducer.toJS().monobjects.stats.props.stats.value);
    });

    it('sets chart data for all charts when the datapoint changes', () => {
        let nextState = initState();
        let action = dataPointChange('cO2Level');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS().months).to.deep.equal(monthStateAfterChangingDataPointToCO2);
    });

    it('sets chart data for weeks when a month is selected', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS().weeks).to.deep.equal(weekStateAfterMonthChange);
    });

    it('sets chart data for days when a week is selected', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS().days).to.deep.equal(daysStateAfterWeekChange);
    });

    it('sets chart data for a day when a day is selected', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        action = dayChange('2016-07-26');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS().days).to.deep.equal(daysStateAfterDayChange);
    });

    it('updates all graphs for when the datapoint changes', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        action = dayChange('2016-07-26');
        nextState = reducer(nextState,action);

        action = dataPointChange('cO2Level');
        nextState = reducer(nextState,action);

        expect(nextState.app.toJS().months).to.deep.equal(monthStateAfterDataPointChangeAndCurrent);
        expect(nextState.app.toJS().weeks).to.deep.equal(weekStateAfterDataPointChangeAndCurrent);
        expect(nextState.app.toJS().days).to.deep.equal(dayStateAfterDataPointChangeAndCurrent);
    });

    it('updates months when the year changes and sets weeks, days to null', () => {
        let nextState = initState();
        let action = monthChange('2016-07-01');
        nextState = reducer(nextState,action);
        action = weekChange('2016-07-24');
        nextState = reducer(nextState,action);
        action = dayChange('2016-07-26');
        nextState = reducer(nextState,action);
        action = yearChange('2015');
        nextState = reducer(nextState,action);
        expect(nextState.app.toJS().months).to.deep.equal(monthStateAfterYearChange);
        expect(nextState.app.toJS().weeks).to.be.undefined;
        expect(nextState.app.toJS().days).to.be.undefined;
    });
});
