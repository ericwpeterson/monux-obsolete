
import {List, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/ducks/index';
import {stats, hydratedStats} from './test_data';
import R, {map} from 'ramda';

describe('reducer', () => {

    it('hydrates the state shape', () => {

        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, '');

        action = {
            type: 'HYDRATE_STATS',
            stats: stats
        };

        nextState = reducer(nextState, action);

        //console.log( 'next state = ', JSON.stringify(nextState, null, 4));

        expect(nextState.monobjects.toJS()).to.deep.equal(hydratedStats);
    });
});
