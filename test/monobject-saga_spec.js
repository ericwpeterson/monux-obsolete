
import {expect} from 'chai';
import {connect, write, read, readNoEffects, SourceDelegator} from '../src/monobject-saga.js';
import { put, call, take, fork }	from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/lib/utils';
import { opStarted, opCompleted } from '../src/monobject-actions';

function printNextValue(gen) {
    console.log(JSON.stringify(gen.next().value, null, 4));
}

describe('monobject saga', () => {

    it('it reads from a event souce and dispatches actions', () => {

        let eventSource = new SourceDelegator(true);

        let msg = {
            data: {
                message: 'opCompleted',
                payload: {
                    monobject: 'mo',
                    'op': 'Get::sites',
                    'value': 123,
                    error: false
                }
            }
        };

        const gen = read(eventSource);
        expect(gen.next().value).to.deep.equal(call(eventSource.nextMessage));
        expect(gen.next(msg).value).to.deep.equal(put(opCompleted(msg.data.payload)));
        expect(gen.next().value).to.deep.equal(call(eventSource.nextMessage));

    });

    it('it pulls all events from a source', (done) => {

        let eventSource = new SourceDelegator(true);
        const gen = readNoEffects(eventSource);

        let event = {
            data: {
                msg: "message",
                payload: {}
            }
        };

        gen.next();

        //we are going to send a bunch of messages to
        //and make sure that all are received by comparing the
        //counts received and sent

        let source = eventSource.source();
        const numEvents = 100;
        let count = 0;

        let interval = setInterval(() => {
            if (count === numEvents) {
                clearInterval(interval);
                expect(eventSource.getCount()).to.equal(count);
                done();
            } else {
                eventSource.source().addEvent(event);
                count++;
            }
        }, 1);

    });

    it('it writes requests to the socket', () => {

        let eventSource = new SourceDelegator(true);

        let action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Set",
                data: {
                    monobject: 'mo',
                    property: 'color',
                    value: 'blue'
                }
            }
        };

        const gen = write(eventSource);
        expect(gen.next(action).value).to.deep.equal(take('SEND_REQUEST'));
        expect(gen.next(action).value).to.deep.equal(put(opStarted(action)));
    });
});
