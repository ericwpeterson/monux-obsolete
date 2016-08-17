
let _ = require('underscore');

import { createMonObject } from '../monobjects/monobject.js';
import { createConnection } from '../monobjects/connections/connection.js';

import {stats} from './test-data.js';

var StatsMonObject = function() {

    let monObject = createMonObject();

    monObject.parent(this);
    monObject.addProps({name: 'stats', fontSize: 12, color: 'red', stats: stats});

    //monobject calls this function when a property watch request
    monObject.connectionCreator(function(monObject, property, socket, cb) {
        return createConnection(monObject, property, socket);
    });

    return {
        get: function(prop, cb, user) {
            return monObject.get(prop,cb,user);
        },

        set: function(prop, value, cb, user) {
            return monObject.set(prop,value,cb,user);
        },

        call: function(method, args, cb, user) {
            if (method === 'testMethod') {
                cb(null, "you called?");
                return;
            } else {
                return monObject.call(method,args,cb,user);
            }
        },

        watch: function(prop, socket, user) {
            return monObject.watch(prop,socket,user);
        },

        unwatch: function(prop, socket, cb, user) {
            return monObject.unwatch(prop,socket,cb,user);
        },

        removeSocket: function(socket) {
            return monObject.removeSocket(socket);
        }
    };
};

export function createStatsObject() {
    return new StatsMonObject();
}

