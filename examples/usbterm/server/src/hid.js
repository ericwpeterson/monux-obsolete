import { createMonObject } from '../monobjects/monobject.js';
import { createConnection } from '../monobjects/connections/connection.js';
import HidDevice from './hiddevice'
import { createConfig } from './config';
import { getAppDataDir, CONFIGFILE_NAME } from './app'

const appDataDir = getAppDataDir();

let config;
var fs = require('fs');

var HidMonObject = function() {
    const MAX_REPLIES = 1000;

    let monObject = createMonObject();
    let replies = [];
    let connected;
    let hid;

    let lostCommTimer;

    let vid, pid;

    fs.mkdir(appDataDir, function (err) {
        config = createConfig(appDataDir + '/' + CONFIGFILE_NAME );

        let location = config.get("location");

        console.log( 'location =', location)

        let connected = false;


        if ( location ) {
            vid = +location.vid;
            pid = +location.pid;
            try {
                hid = new HidDevice(vid, pid, onRead, onError);
                console.log("connected")
                connected = true;
            } catch(e) {
                console.log(e);
                setTimeout( reconnect, 1000);
            }
        }

        monObject.parent(this);
        monObject.addProps({name: 'hid', replies: replies, 'connected': connected, 'location': {'vid': vid, 'pid': pid} });
    });


    //monobject calls this function when a property watch request
    monObject.connectionCreator(function(monObject, property, socket, cb) {
        return createConnection(monObject, property, socket);
    });

    let onError = (err) => {
        var timeDisconnected = new Date();

        //use a timer so we dont set the state to idle when UPM restarts
        lostCommTimer = setTimeout( ()=> {
            monObject.set('connected',false,()=>{});
        }, 6000 );

        console.log('on usb error')
        setTimeout(reconnect, 1000);
    }


    let onRead = (rbuf) => {
        replies.push(rbuf);

        if ( replies.length > MAX_REPLIES ) {
            replies.shift();
        }

        monObject.set('replies',replies,()=>{});
    }

    let reconnect = () => {
        try {
            hid = new HidDevice(vid, pid, onRead, onError);
            if (lostCommTimer) {
                clearTimeout(lostCommTimer);
                lostCommTimer = false;
            }
            connected = true;
            console.log( 'reconnected to the device!')
            monObject.set('connected',true,()=>{});

        } catch(e) {
            if ( connected ) {
                monObject.set('connected',false,()=>{});
            }
            connected = false;
            setTimeout(reconnect, 1000);
        }
    }

    let setLocation = (location, cb) => {
        console.log( 'setting location = ', location );

        if ( location.vid ) {
            vid = +location.vid;
        }
        if ( location.pid ) {
            pid = +location.pid;
        }

        let loc = {'vid': vid, 'pid': pid};
        monObject.set('location', loc, ()=>{});
        config.set('location', loc);

        try {
            hid = new HidDevice(vid, pid, onRead, onError);
            monObject.set('connected',true,()=>{});
            cb()
        } catch(e) {
            monObject.set('connected',false,()=>{});
            console.log(e);
            cb()
            setTimeout( reconnect, 1000);
        }
    }


    return {

        get: function(prop, cb, user) {
            return monObject.get(prop,cb,user);
        },

        set: function(prop, value, cb, user) {
            if ( prop === 'location' ) {
                setLocation(value, cb);
            } else {
                return monObject.set(prop,value,cb,user);
            }
        },

        call: function(method, args, cb, user) {
            if (method === 'write') {
                let buf = args[0];
                buf += '\r';
                hid.write(buf);
                cb(null, '');
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

export function createHidObject() {
    return new HidMonObject();
}
