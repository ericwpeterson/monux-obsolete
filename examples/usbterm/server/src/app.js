import { createMonObject } from '../monobjects/monobject.js';
import { createConnection } from '../monobjects/connections/connection.js';
import { createConfig } from './config';

export const  CONFIGFILE_NAME = 'app.cfg'

const APPNAME = "UsbTerm"
//const {app} = require('electron')
const appDataDir = "c:/"  + APPNAME;

export function getAppDataDir() {
    return appDataDir;
}

let config;
var fs = require('fs');

var AppMonObject = function() {
    let monObject = createMonObject();
    monObject.parent(this);

    //monobject calls this function when a property watch request occurs
    monObject.connectionCreator(function(monObject, property, socket, cb) {
        return createConnection(monObject, property, socket);
    });


    fs.mkdir(appDataDir, function (err) {
        config = createConfig(appDataDir + '/' + CONFIGFILE_NAME );

        monObject.addProps({appDataDir: appDataDir, name: 'app' });
    });

    return {
        get: function(prop, cb, user) {
            return monObject.get(prop,cb,user);
        },

        set: function(prop, value, cb, user) {
            return monObject.set(prop,value,cb,user);
        },

        call: function(method, args, cb, user) {
            return monObject.call(method,args,cb,user);
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

export function createAppObject() {
    return new AppMonObject();
}
