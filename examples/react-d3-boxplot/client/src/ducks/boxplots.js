import {Map, List } from 'immutable';
import Immutable from 'immutable';
import R, {map} from 'ramda';

import toD3BoxPlot, {toD3BoxPlotMinMax, toD3BoxPlotDebug } from '../to-d3-boxplot'

const DEFAULT_STATE = Map({currentDataPoint: 'temperatureF'});

// Actions
const DATAPOINT_CHANGE  = 'app/DATAPOINT_CHANGE';
const OP_COMPLETED      = 'monobject/OP_COMPLETED';
const MONTH_CHANGE      = 'app/MONTH_CHANGE';
const WEEK_CHANGE       = 'app/WEEK_CHANGE';
const DAY_CHANGE        = 'app/DAY_CHANGE';

const MOUNT_CHART     = 'app/MOUNT_CHART';

export default function(wrapped) {
    let ret = function(state = DEFAULT_STATE, action) {
        let ret;
        switch (action.type) {

            case OP_COMPLETED:
                let stats = reduce(state, action);
                if ( stats ) {
                    ret = state.set('stats', stats );
                    let data = toD3BoxPlot(ret.get('currentDataPoint'))  (ret.get('stats'));
                    let plotMinMax = toD3BoxPlotMinMax(data);
                    ret = ret.set('months', Map({}) )  ;
                    ret = ret.setIn(['months', 'chartData'], data );
                    ret = ret.setIn(['months', 'minMax'], plotMinMax );
                    return ret;
                } else {
                    return wrapped(state, action);
                }
                break;

            case DATAPOINT_CHANGE:
                return updateCharts(state, action.dataPoint);

            case MONTH_CHANGE:
                return changeMonth(state, action.month);

            case WEEK_CHANGE:
                return changeWeek(state, action.week);

            case DAY_CHANGE:
                return changeDay(state, action.day);

            case MOUNT_CHART:
                return changeChartMountValue( state, action.payload );
        }

        return wrapped(state, action);
    };
    return ret;
}

function changeChartMountValue(state, chartData) {
    console.log('changeChartMountValue', chartData )

    if (chartData.chart === 'app') {
        return state.set('unMountChild', chartData.value );
    } else {
        return state.setIn([chartData.chart, 'unMountChild'], chartData.value );
    }
}

function changeMonth(state, month) {
    let ret = state.setIn(['months', 'currentMonth'], month );
    ret = ret.setIn(['months', 'unMountChild'], true );
    let items = ret.get('stats')[month];
    let data = toD3BoxPlot(ret.get('currentDataPoint'))(items.children);
    let plotMinMax = toD3BoxPlotMinMax(data);

    ret = ret.set('weeks', Map({}));
    ret = ret.setIn(['weeks', 'chartData'], data );
    ret = ret.setIn(['weeks', 'minMax'], plotMinMax );

    //when the month changes we need to nuke the days
    if (ret.get('days')) {
        ret = ret.delete('days');
    }
    if (ret.get('day')) {
        ret = ret.delete('day');
    }
    return ret;
}

function changeWeek(state, week) {
    let month = state.getIn(['months', 'currentMonth']);
    let ret = state.setIn(['weeks', 'currentWeek'], week );
    ret = ret.setIn(['weeks', 'unMountChild'], true );
    let items = ret.get('stats')[month].children[week];
    let data = toD3BoxPlot(ret.get('currentDataPoint'))(items.children);
    let plotMinMax = toD3BoxPlotMinMax(data);
    ret = ret.set('days', Map({}));
    ret = ret.setIn(['days', 'chartData'], data );
    ret = ret.setIn(['days', 'minMax'], plotMinMax );

    //when the week changes we need to nuke the day
    if (ret.get('day')) {
        ret = ret.delete('day');
    }
    return ret;
}

function changeDay(state, day) {
    let ret = state.setIn(['days', 'currentDay'], day);
    ret = ret.setIn(['days', 'unMountChild'], true );
    return ret;
}

//this fucnction intercepts responses and formats the data
//in a way that is easy to recall
function reduce(state, action) {
    let ret;

    if (action.payload.monObject === 'stats') {
        let tokens = action.payload.op.split('::');
        let cmd = tokens[0];
        let arg = tokens[1]; //may be a property or method name

        if (cmd === 'Get' && arg === 'stats') {
            ret = hydrateStats(action.payload.value);
        }
    }

    return ret;
}

function updateCharts(state, dataPoint) {
    let ret;
    ret = state.set('currentDataPoint', dataPoint);
    ret = ret.set('unMountChild', true);

    let month;
    let week;

    if (state.get('months') ) {
        month = ret.getIn(['months', 'currentMonth']);
        let data = toD3BoxPlot(ret.get('currentDataPoint'))  (ret.get('stats'));
        let plotMinMax = toD3BoxPlotMinMax(data);
        ret = ret.set('months', Map({}));
        ret = ret.setIn(['months', 'unMountChild'], true );
        ret = ret.setIn(['months', 'chartData'], data );
        ret = ret.setIn(['months', 'minMax'], plotMinMax );
        if( month ) {
            ret = ret.setIn(['months', 'currentMonth'], month );
        }
    }
    if ( month ) {
        if (ret.get('weeks') ) {
            let week = ret.getIn(['weeks', 'currentWeek']);

            //if (week) {
                let items = ret.get('stats')[month];
                let data = toD3BoxPlot(ret.get('currentDataPoint'))  (items.children);
                let plotMinMax = toD3BoxPlotMinMax(data);
                ret = ret.set('weeks', Map({}));
                ret = ret.setIn(['weeks', 'unMountChild'], true );
                ret = ret.setIn(['weeks', 'chartData'], data );
                ret = ret.setIn(['weeks', 'minMax'], plotMinMax );
                ret = ret.setIn(['weeks', 'currentWeek'], week );

                if (ret.get('days') ) {
                    let day = ret.getIn(['days', 'currentDay']);
                    if ( week ) {
                        let items = ret.get('stats')[month].children[week];
                        let data = toD3BoxPlot(ret.get('currentDataPoint'))  (items.children);
                        let plotMinMax = toD3BoxPlotMinMax(data);
                        ret = ret.set('days', Map({}));
                        ret = ret.setIn(['days', 'unMountChild'], true );
                        ret = ret.setIn(['days', 'chartData'], data );
                        ret = ret.setIn(['days', 'minMax'], plotMinMax );
                        ret = ret.setIn(['days', 'currentDay'], day );
                    }
                }
            //}
        }
    }

    return ret;
}

export function hydrateStats(s) {
    if (s.length !== 1) {
        console.error('malformed stat info');
        return {};
    }
    let stats = s[0];

    let wr = R.curry(( days, acc, val ) => {
        acc[val.date] = R.pick( R.without(['date'], R.keys(val)), val );
        let dim = getDaysInWeek(days, val.date);
        let r = (acc,val) => {
            acc[val.date] = R.pick( R.without(['date'], R.keys(val)), val );
            return acc;
        }
        let f = R.compose( R.reduce( r, {}), R.map(( i ) => i) );
        acc[val.date].children = f(dim);
        return acc;
    });
    let mr = R.curry(( weeks, acc, val ) => {
        acc[val.date] = R.pick( R.without(['date'], R.keys(val)), val );

        let wim = getWeeksInMonth(weeks, val.date);
        let f = R.compose( R.reduce(wr(stats.daily), {}), R.map(( i ) => i) )
        acc[val.date].children = f(wim);
        return acc;
    });

    let mapAndReduceMonths = R.compose( R.reduce(mr(stats.weekly), {}), R.map(( i ) => i) )
    return mapAndReduceMonths(stats.monthly);
}

let isNumberInRange = (high, low, val) => val >= low && val < high;

let isWeekInMonth = R.curry((month, week) => {
    let tokens = month.split('-');
    let y = tokens[0];
    let m = tokens[1];
    tokens = week.date.split('-');
    return (tokens[0] === y && tokens[1] === m);
});

let isDayInWeek = R.curry((week, day) => {
    let weekBegin = new Date(week);
    let weekEnd = new Date(weekBegin.getTime() + 7 * 86400000);
    let d = new Date(day.date);
    return (isNumberInRange(weekEnd.getTime(), weekBegin.getTime(), d.getTime()));
});

let getWeeksInMonth = (weeks, month) => R.filter(isWeekInMonth(month), weeks);
let getDaysInWeek = (days, week) => R.filter(isDayInWeek(week), days);


//Action Creators

export function dataPointChange(dataPoint) {
    return {
        type: DATAPOINT_CHANGE,
        dataPoint: dataPoint
    };
}

//TODO: for these to be pure we need to get the current month, week and day
//and pass them in ugh, glad i did this on a branch!!!!

export function monthChange(month) {
    return {
        type: MONTH_CHANGE,
        month: month
    };
}

export function weekChange(week) {
    return {
        type: WEEK_CHANGE,
        week: week
    };
}

export function dayChange(day) {
    return {
        type: DAY_CHANGE,
        day: day
    };
}

//chart is one of weeks days or day
export function mountChart(chart, val) {
    return {
        type: MOUNT_CHART,
        payload: {
            chart: chart,
            value: val
        }
    };
}
