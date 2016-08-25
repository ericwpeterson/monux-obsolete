import {Map, List } from 'immutable';
import Immutable from 'immutable';
import R, {map} from 'ramda';

const DEFAULT_STATE = Map({});
const OP_COMPLETED  = 'monobject/OP_COMPLETED';

export default function(wrapped) {

    let ret = function(state = DEFAULT_STATE, action) {

        switch (action.type) {
            case OP_COMPLETED:
                let reduced = reduce(state, action);
                if (reduced) {
                    return wrapped(state, reduced);
                }
                break;
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
