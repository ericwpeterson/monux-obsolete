
export function opStarted(action) {
    return {
        type: 'OP_STARTED',
        payload: action
    };
}

export function opCompleted(payload) {
    return {
        type: 'OP_COMPLETED',
        payload: payload
    };
}

export function get(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Get",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}

export function set(monobject, property, value) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Set",
            data: {
                monObject: monobject,
                property: property,
                value: value
            }
        }
    };
}

export function call(monobject, method, args) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Call",
            data: {
                monObject: monobject,
                method: method,
                args: args
            }
        }
    };
}

export function watch(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Watch",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}

export function unwatch(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "UnWatch",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}

export function init() {
    return {
        type: 'INIT',
        payload: {}
    };
}
