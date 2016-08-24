
import {Map, List } from 'immutable';
import Immutable from 'immutable';
import R, {map} from 'ramda';

const DEFAULT_STATE = Map({});

export default function(wrapped) {

    let ret = function(state = DEFAULT_STATE, action) {

        switch (action.type) {

            case 'OP_COMPLETED':
                let reduced = reduce(state, action);
                if (reduced) {
                    return wrapped(state, reduced);
                }
                break;

            case 'HYDRATE_STATS':
                ret = hydrateStats(action.stats);
                return state.set('stats', ret);

        }
        return wrapped(state, action);
    };
    return ret;
}

function reduce(state, action) {
    let ret;

    if (action.payload.monObject === 'stats') {
        let tokens = action.payload.op.split('::');
        let cmd = tokens[0];
        let arg = tokens[1]; //may be a property or method name

        if (cmd === 'Get' && arg === 'stats') {
            action.payload.value = hydrateStats(action.payload.value);
            ret = action;
        }
    }

    return ret;
}

export function hydrateStats(s) {
    const dataPoints = ['relativeHumidity', 'cO2Level', 'temperatureF'];

    if (s.length !== 1) {
        console.error('malformed stat info');
        return {};
    }
    let stats = s[0];
    let ret = {};
    ret.range = {};

    let aggregateMinMaxByDataPoint = dataPoint => {
        try {
            ret.range[dataPoint] = aggregateMinMax(dataPoint)(stats.monthly)[dataPoint];
        } catch (e) {console.log(e);}
    };
    R.forEach(aggregateMinMaxByDataPoint, dataPoints);
    R.forEach(i => ret[i.date] = i, R.map(processMonth(dataPoints, stats.daily, stats.weekly), stats.monthly));
    return ret;
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

let saveDataPoints = R.curry((dataPoint, item) => {
    let ret = [];
    let append = n => ret.push(n);
    append(item[dataPoint].min);
    append(item[dataPoint].max);
    R.forEach(append, item[dataPoint].outliers);
    return ret;
});

let initMinMaxContainer = (key) => {
    let ret = {};
    ret[key] = {};
    ret[key].min = +Infinity;
    ret[key].max = -Infinity;
    return ret;
};

let computeMinMax = R.curry((dataPoint, values) => {
    let ret = initMinMaxContainer(dataPoint);
    let compareVals = (val,key) => {
        if (val < ret[dataPoint].min) {
            ret[dataPoint].min = val;
        }
        if (val > ret[dataPoint].max) {
            ret[dataPoint].max = val;
        }
    };
    R.forEach(compareVals,  values);
    return ret;
});

let aggregateMinMax = (dataPoint) => R.compose(computeMinMax(dataPoint), R.flatten, R.map(saveDataPoints(dataPoint)));

let processMonth = R.curry((dataPoints, days, weeks, month) => {

    let ret = R.clone(month);
    ret.range = {};
    ret.children = {};
    let weeksInMonth = getWeeksInMonth(weeks, ret.date);

    if (weeksInMonth.length) {
        let aggregateMinMaxByDataPoint = dataPoint => {
            try {
                ret.range[dataPoint] = aggregateMinMax(dataPoint)(weeksInMonth)[dataPoint];
            } catch (e) {console.log(e);}
        };
        R.forEach(aggregateMinMaxByDataPoint, dataPoints);
        let processWeek = week => {
            ret.children[week.date] = week;
            ret.children[week.date].range = {};
            ret.children[week.date].children = {};
            let daysInWeek = getDaysInWeek(days, week.date);

            if (daysInWeek.length) {
                let aggregateMinMaxByDataPoint = dataPoint => {
                    try {
                        ret.children[week.date].range[dataPoint] = aggregateMinMax(dataPoint)(daysInWeek)[dataPoint];
                    } catch (e) {console.log(e);}
                };
                R.forEach(aggregateMinMaxByDataPoint, dataPoints);
                let processDay = day => {
                    ret.children[week.date].children[day.date] = day;
                };
                R.forEach(processDay, daysInWeek);
            }
        };
        R.forEach(processWeek, weeksInMonth);
    }

    return ret;
});

//Action Creators

export function opStarted(stats) {
    return {
        type: 'HYDRATE_STATS',
        stats: stats
    };
}
