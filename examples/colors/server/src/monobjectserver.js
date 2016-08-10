
var USE_JWT = false;

let factory = null;

function getUser(socket) {
    if (USE_JWT) {
        //if using JWT tp
        var jwt = require('jwt-simple');
        var user;
        var ret = '';

        if (socket.handshake && socket.handshake.query && socket.handshake.query.token) {
            user = jwt.decode(socket.handshake.query.token, process.env.NODE_JWT);

            if (_.has(user, 'username')) {
                ret = user.username;
            }
        }
        return ret;
    } else {
        return '';
    }
}

function validRequest(factory, requestName, request) {

    console.log(requestName, JSON.stringify(request,null,4));

    try {
        if (!request.monObject) {
            throw new Error(requestName + ' error: no monObject supplied');
        } else {
            if (!factory.getMonObject(request.monObject)) {
                throw new Error(requestName + " error: no monObject exists " + request.monObject);
            }
        }

        //call requires a method name and args
        if (requestName === 'call') {
            if (!request.args) {
                throw new Error(requestName + "error: no args");
            }
            if (!request.method) {
                throw new Error(requestName + "error: no method");
            }

        } else {

            //all other requests require a property
            if (!request.property) {
                throw new Error(requestName + "error: no property");
            }

            //this one requires a value
            if (request.property === 'set') {
                if (!request.value) {
                    throw new Error(requestName + "error: no value");
                }
            }
        }
    } catch (e) {
        console.log(e, requestName, request);
        return false;
    }

    return true;
}

let monObjectServer = {

    get: (request, socket, cb) => {
        if (validRequest(factory,'get', request)) {
            factory.getMonObject(request.monObject).get(request.property, (err, result) => {                
                socket.emit("opCompleted", {'op': "Get::" + request.property, 'monObject': request.monObject, "value": result, 'error': err});
                cb(err, result);
            }, getUser(socket));
        } else {
            cb(true, 'invalid args');
        }
    },

    set: (request, socket, cb) => {
        if (validRequest(factory,'set', request)) {
            factory.getMonObject(request.monObject).set(request.property, request.value, (err, result) => {
                socket.emit("opCompleted", {'op': "Set::" + request.property, 'monObject': request.monObject, 'error': err, 'value': request.value});
                cb(err, result);
            }, getUser(socket));
        } else {
            cb(true, 'invalid args');
        }
    },

    watch: (request, socket, cb) => {
        if (validRequest(factory,'watch', request)) {
            socket.emit("opCompleted", {'op': "Watch::" + request.property, 'monObject': request.monObject, 'error': false});
            factory.getMonObject(request.monObject).watch(request.property, socket, getUser(socket));
            cb();
        } else {
            cb(true, 'invalid args');
        }
    },

    unWatch: (request, socket, cb) => {
        if (validRequest(factory,'unwatch', request)) {
            socket.emit("opCompleted", {'op': "UnWatch::" + request.property, 'monObject': request.monObject, 'error': false});
            factory.getMonObject(request.monObject).unwatch(request.property, socket, getUser(socket));
            cb();
        } else {
            cb(true, 'invalid args');
        }
    },

    call: (request, socket, cb) => {
        if (validRequest(factory,'call', request)) {
            factory.getMonObject(request.monObject).call(request.method, request.args, (err, value) => {
                socket.emit("opCompleted", {'op': "Call::" + request.method, 'monObject': request.monObject, 'ret': value, 'error': err});
                cb(err,value);
            }, getUser(socket));
        } else {
            cb(true, 'invalid args');
        }
    }
};

export function initFactory(f) {
    factory = f;
}

export default monObjectServer;
