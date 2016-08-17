import _ from 'underscore';

function MonObject()  {
    this.props = {};

    //key is a property string, value is a connection object
    //the connection object has an array of sockets
    this.watchers = {};

    //key is socket, value is an array of watchers
    this.watchSockets = {};
}

MonObject.prototype.get = function(prop, cb, user) {
    if (_.has(this.props, prop)) {
        cb(null,this.props[prop]);
        return;
    }
    cb({'errDesc': 'no such property: ' + prop});
    return;
};

MonObject.prototype.set = function(prop, value, cb, user) {
    if (_.has(this.props, prop)) {
        this.props[prop] = value;
        if (this.watchers[prop]) {
            this.watchers[prop].notifyValue(value);
        }
        cb();
        return;
    }
    cb({'errDesc': 'no such property: ' + prop});
    return;
};

MonObject.prototype.call = function(method, args, cb, user) {
    cb({'errDesc': 'no such method: ' + method});
};

MonObject.prototype.removeSocket = function(socket) {
    //Remove the socket from all watchers it is associated with.
    var socketWatchers = this.watchSockets["" + socket.id];

    if (!socketWatchers) {
        return;
    }
    _.each(socketWatchers, function(watcher, index) {
        watcher.removeSocket(socket.id);
        if (watcher.socketCount() === 0) {
            delete this.watchers["" + watcher.id];
        }
    }, this);

    delete this.watchSockets["" + socket.id];
};

MonObject.prototype.watch = function(prop, socket, user) {
    var watcher = this.watchers[prop];

    if (!watcher) {
        watcher = this.connectionCreator(this, prop, socket);
        this.watchers[prop] = watcher;
    } else {
        watcher.addSocket(socket);
    }

    if (!this.watchSockets["" + socket.id]) {
        this.watchSockets["" + socket.id] = [];
    }

    this.watchSockets["" + socket.id].push(watcher);
};

MonObject.prototype.unwatch = function(prop, socket, user) {
    var socketWatchers = this.watchSockets["" + socket.id];

    if (socketWatchers) {
        var watcher = _.find(socketWatchers, function(watcher) { return (watcher.id === prop) ? true : false; });

        if (watcher) {
            watcher.removeSocket(socket.id);
            if (watcher.socketCount() === 0) {
                this.watchers["" + watcher.id].cleanUp(() => {
                    delete this.watchers["" + watcher.id];
                });
            }
        }
    }
};

MonObject.prototype.parent = function(p) {
    this.parent = p;
};

MonObject.prototype.getName = function(p) {
    return this.props.name;
};

MonObject.prototype.addProps = function(p) {
    this.props = p;
};

MonObject.prototype.connectionCreator = function(f) {
    this.connectionCreator = f;
};

export function createMonObject() {
    return new MonObject();
}
