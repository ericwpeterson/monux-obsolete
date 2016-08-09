import {expect} from 'chai';
import {Map, List } from 'immutable';
import Immutable from 'immutable';
import reducer from '../src/monobject-reducer';
import {REQUEST} from '../src/monobject-reducer';
import { opCompleted, opStarted }  from '../src/monobject-actions';
import _ from 'underscore';

function prettyPrint() {
    _.each(arguments, (arg) => {
        console.log(JSON.stringify(arg, null, 4));
    });
}

describe('monobject reducer', () => {

    it('sets the initial state', () => {

        const action = {
            type: 'INIT'
        };

        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(Map({}));
    });

    it('sets opCompleted state on prop when successful for Get', () => {
        const action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Get::sites',
            'value': 123,
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);
    });


    it('sets opCompleted state = ERROR when there is an error', () => {
        const action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Get::sites',
            'value': 123,
            error: true
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "state": "ERROR"
                        }
                    }
                }
            }
        };
        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opCompleted state and preserves value when Watch is called without a value ', () => {
        const action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Get::sites',
            'value': 123,
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));

        payload = {
            monobject: 'mo',
            'op': 'Watch::sites',
            error: false
        };

        ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opCompleted state on prop when successful for Call', () => {
        const action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Call::walkDog',
            'value': 123,
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "methods": {
                        "walkDog": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('mutates value when Watch is called with a value ', () => {
        const action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Get::sites',
            'value': 123,
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));

        payload = {
            monobject: 'mo',
            'op': 'Watch::sites',
            value: 321,
            error: false
        };

        ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "sites": {
                            "value": 321,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opStarted state for methods when value is null', () => {
        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Call",
                data: {
                    monobject: 'mo',
                    method: 'walkDog'
                }
            }
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "methods": {
                        "walkDog": {
                            "state": REQUEST.IN_PROGRESS
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opStarted(action));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opStarted state for properties when value is null', () => {
        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Set",
                data: {
                    monobject: 'mo',
                    property: 'color',
                    value: 'green'
                }
            }
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "color": {
                            "state": REQUEST.IN_PROGRESS
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opStarted(action));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opStarted state for methods when value is not null', () => {
        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Call::walkDog',
            'value': 123,
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "methods": {
                        "walkDog": {
                            "value": 123,
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);

        action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Call",
                data: {
                    monobject: 'mo',
                    method: 'walkDog'
                }
            }
        };

        ret = {
            "monobjects": {
                "mo": {
                    "methods": {
                        "walkDog": {
                            "value": 123,
                            "state": REQUEST.IN_PROGRESS
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opStarted(action));
        expect(nextState.toJS()).to.deep.equal(ret);
    });

    it('sets opStarted state for properties when value is not null', () => {
        let action = {
            type: 'INIT'
        };

        let nextState = reducer(undefined, action);

        let payload = {
            monobject: 'mo',
            'op': 'Get::color',
            'value': 'green',
            error: false
        };

        let ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "color": {
                            "value": 'green',
                            "state": REQUEST.COMPLETED
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opCompleted(payload));
        expect(nextState.toJS()).to.deep.equal(ret);

        action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Set",
                data: {
                    monobject: 'mo',
                    property: 'color',
                    'value': 'blue'
                }
            }
        };

        ret = {
            "monobjects": {
                "mo": {
                    "props": {
                        "color": {
                            "value": 'green',
                            "state": REQUEST.IN_PROGRESS
                        }
                    }
                }
            }
        };

        nextState = reducer(nextState, opStarted(action));
        expect(nextState.toJS()).to.deep.equal(ret);
    });
});

