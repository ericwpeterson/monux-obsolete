
import {List, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducers/index';
import {stats, hydratedStats} from './test_data';
import R, {map} from 'ramda';

describe('reducer', () => {

    it('sets the initial state', () => {

        const action = {
            type: 'INIT'
        };

        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(Map({}));
    });

    it('hydrates the state shape', () => {

        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);
        expect(nextState).to.equal(Map({}));

        action = {
            type: 'HYDRATE_STATS',
            stats: stats
        };

        nextState = reducer(nextState, action);

        //console.log( 'next state = ', JSON.stringify(nextState, null, 4));

        expect(nextState.toJS()).to.deep.equal(hydratedStats);
    });
});

    //TODO: we need make this entire object immutable

/*
    it('state be composed of nested immutable maps', () => {

        const action = {
            type: 'HYDRATE_STATS',
            stats: stats
       };

        const nextState = reducer(undefined, action);
        expect(nextState.toJS()).to.deep.equal(hydratedStats);

       try {

            let s = nextState.getIn(['stats', '2016-07-01', 'children', '2016-07-31',
                                  'children', '2016-08-02', 'stats' ])

            s = nextState.setIn(['stats', '2016-07-01', 'children', '2016-07-31',
                                  'children', '2016-08-02', 'stats', 'cO2Level' ], 1000)

            let storable = s.toJS();

       } catch( e ) {
           expect(e).to.equal('');
       }

       expect(nextState.toJS()).to.deep.equal(hydratedStats);
    });

    it('should detach all references ( be a deep copy )', () => {

       //copying stats because imported data is read only
       //for this test we need to be able to change it

       let immutableCopy = new List(stats);
       let statsCopy = immutableCopy.toJS();

       const action = {
            type: 'HYDRATE_STATS',
            stats: statsCopy
       };

        const nextState = reducer(undefined, action);

        expect(nextState.toJS()).to.deep.equal(hydratedStats);

        //lets modify the source data and make sure the state has not changed
        let months  = statsCopy[0].monthly;
        let monthStats = _.find(months, (month) => { return month.date === '2015-11-01'}  );

        monthStats.cO2Level.median = 7; //was 424
        expect(nextState.toJS()).to.deep.equal(hydratedStats);
    });
    */    

