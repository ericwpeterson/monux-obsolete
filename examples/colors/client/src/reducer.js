
import {Map, List } from 'immutable';
import Immutable from 'immutable';

import _ from 'underscore';

const DEFAULT_STATE = Map({});

export default function(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case 'HYDRATE_STATS':
            return hydrateStats(state, action.stats);

        case 'INIT':
            return state;

    }

    return state;
}

function prettyPrint() {
    _.each ( arguments, (arg) => {
        console.log( JSON.stringify(arg, null, 4) );
    });
}

function MinMax(dataPoints) {
    //initialize a structure so we can store min and max for each dataPoint in the group
    let savedMinMax = {};    
    _.each( dataPoints, (dataPoint) => {
        savedMinMax[dataPoint] = { min: +Infinity, max: -Infinity };
    });

    return {
        insert: function(dataPoint, val) {
            if ( val < savedMinMax[dataPoint].min ) {
                savedMinMax[dataPoint].min = val;
            }
            if ( val > savedMinMax[dataPoint].max ) {
                savedMinMax[dataPoint].max = val;
            }
        },
        computedVals: function() {
            return savedMinMax;
        }
    }
}      

export function hydrateStats( state, s ) {
    let copy = Immutable.fromJS(s);
    let stats = copy.toJS();

    let dataPoints = ['cO2Level', 'relativeHumidity', 'temperatureF'];

    let months  = stats[0].monthly; 
    let weeks   = stats[0].weekly; 
    let days    = stats[0].daily;     
    
    let map = Map();

    function getDaysInWeek( date, days ) {
                       
        let weekBegin = new Date(date);
        let weekEnd = new Date( weekBegin.getTime() + 7 * 86400000 );

        var daysInWeek = _.filter( days, (day) => {
            let date = new Date(day.date);
            return  ( date.getTime() >= weekBegin.getTime() && date.getTime() < weekEnd.getTime() );                 
        });

        let map = Map({});
        
        _.each( daysInWeek, (val) => {
            let stats = Map({});            
            _.each( dataPoints, (dataPoint) => {
                stats = stats.set(dataPoint,val[dataPoint]);                
            });
            map = map.setIn([ val.date, 'type'], 'day');            
            map = map.setIn([val.date, 'stats'], stats);
        });

        return map;
    }

    function getWeeksInMonth( date, weeks ) {
        let tokens = date.split('-');
        let year = tokens[0];
        let month = tokens[1];

        var weeksInMonth = _.filter( weeks, (week) => {
            let tokens = week.date.split('-');
            return ( tokens[0] === year && tokens[1] === month );
        });
        
        let map = Map({});
                
        _.each( weeksInMonth, (val) => {                   
            let stats = Map({});

            let minMax = new MinMax(dataPoints);
            
            _.each( dataPoints, (dataPoint) => {
                stats = stats.set(dataPoint,val[dataPoint]);
                minMax.insert(dataPoint,val[dataPoint].min);
                minMax.insert(dataPoint,val[dataPoint].max);                
                _.each( val[dataPoint].outliers, (value) => {
                    minMax.insert(dataPoint,value);
                });
            });

            map = map.setIn([ val.date, 'type'], 'week');
            map = map.setIn([ val.date, 'range'], minMax.computedVals());
            map = map.setIn([ val.date, 'stats'], stats);
            map = map.setIn([ val.date, 'children'], getDaysInWeek(val.date, days ));

        });

        return map;
    }

    _.each( months, (val) => {
       
        let stats = Map({});
       

         let minMax = new MinMax(dataPoints);

        _.each( dataPoints, (dataPoint) => {
            stats = stats.set(dataPoint,val[dataPoint] );
            minMax.insert(dataPoint,val[dataPoint].min);
            minMax.insert(dataPoint,val[dataPoint].max);                
            _.each( val[dataPoint].outliers, (value) => {
                minMax.insert(dataPoint,value);
            });
        });

        map = map.setIn([ val.date, 'type'], 'month');
        map = map.setIn([ val.date, 'range'], minMax.computedVals());
        map = map.setIn( [ val.date, 'stats'], stats);
        map = map.setIn( [ val.date, 'children'], getWeeksInMonth(val.date, weeks ));
                

    });
    
    return state.set('stats', map);    
}
