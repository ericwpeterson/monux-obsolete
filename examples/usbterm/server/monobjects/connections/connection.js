var _ = require("underscore");

function Connection(monObject, prop, socket) {
    this.monObject = monObject;
    this.prop = prop;

    this.sockets = [socket];

    if (typeof this.prop === 'object') {
        //not a very like use case for most folks, was used for dynamic properties that 
        //mongo query objects

        this.id = JSON.stringify(this.prop);
    } else {
        this.id = this.prop;
    }

    this.monObject.get(this.prop, (err, value) => {
        socket.emit("opCompleted", {'op': "Watch::" + this.prop, 'monObject': this.monObject.getName(), 'value': value, 'error': err});
    });
}

Connection.prototype.addSocket = function(socket) {
    this.sockets.push(socket);
    this.monObject.get(this.prop, (err, value) => {
        socket.emit("opCompleted", {'op': "Watch::" + this.prop, 'monObject': this.monObject.getName(), 'value': value, 'error': err});
    });
};

Connection.prototype.removeSocket = function(socketId) {
    this.sockets = _.filter(this.sockets, function(skt) {
        return skt.id !== socketId;
    });
};

Connection.prototype.notifyValue = function(value) {
    _.each(this.sockets, (socket) => {
        socket.emit("opCompleted", {'op': "Watch::" + this.prop, 'monObject': this.monObject.getName(), 'value': value});
    });
};

Connection.prototype.socketCount = function(cb) {
    return this.sockets.length;
};

//implement this if your connection has an outstanding query or any pending asnyc task
Connection.prototype.cleanUp = function(cb) {
    cb();
};

export function createConnection(monObject, property, socket, cb) {
    return new Connection(monObject, property, socket, cb);
}
