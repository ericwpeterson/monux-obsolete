
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
            if (method === 'getLineChartData') {
                if ( args.length && args.length === 2 ) {
                    let tokens = args[0].split('-');
                    if ( !tokens.length || tokens.length !== 3) {
                        cb("invalid args", "getLineChartData");
                    } else {

                        let y = tokens[0];
                        let m = tokens[1];
                        let d = tokens[2];

                        let dayBegin = new Date(y,+m - 1,d);
                        let dayEnd = new Date( dayBegin.getTime() + 86400000);


                        let increase;
                        if ( args[1] === 'temperatureF') {
                            increase = Math.PI * 10 / 17280;
                        } else if ( args[1] === 'cO2Level') {
                            increase = Math.PI * 20 / 17280;
                        } else {
                            increase = Math.PI * 30 / 17280;
                        }

                        let counter = 0;
                        let data = []
                        for ( let i = dayBegin.getTime(); i <= dayBegin.getTime() + 86400000; i+=5000 ) {
                          data.push({date: i, val: Math.sin( counter ) / 2 + 0.5});
                          counter += increase;
                        }

                        setTimeout(()=>cb(null, data), 3000);

                    }
                } else {
                    cb("invalid args", "getLineChartData");
                }
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
