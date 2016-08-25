
import {List, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/ducks/index';
import {stats, hydratedStats} from './test_data';
import {opCompleted} from '../src/ducks/monobject';

describe('reducer', () => {
    it('hydrates the stats monobject', () => {

        let nextState = reducer(undefined, {type: ''});

        let payload = {
            monObject: 'stats',
            op: 'Get::stats',
            value: stats
        };

        let action = opCompleted(payload);

        nextState = reducer(nextState, action);
        expect(nextState.monobjects.toJS()).to.deep.equal(hydratedStats);
    });
});
