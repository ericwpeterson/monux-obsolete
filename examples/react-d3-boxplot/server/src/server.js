import Server from 'socket.io';
import {List, Map} from 'immutable';

import monObjectFactory from '../monobjects/factory';

import monObjectServer from './monobjectserver';
import { initFactory } from './monobjectserver';
import { createStatsObject } from './stats';
import async from 'async';

let monObject = createStatsObject();

monObjectFactory.insertObject('stats', monObject);
initFactory(monObjectFactory);

export default function startServer() {

    const io = new Server().attach(8090);

    io.on('connection', function(socket) {
        socket.on('disconnect', function() {
            monObjectFactory.removeSocket(socket);
        });

        socket.on('Batch', function(requests) {

            async.eachSeries(requests, function(request, cb) {

                switch ( request.command ) {
                    case "Get":
                        monObjectServer.get(request.request, socket, function(err, res) {
                            if (err) {
                                console.log(err, res);
                            }
                            cb();
                        });

                    case "Set":
                        monObjectServer.set(request.request, socket, function(err, res) {
                            if (err) {
                                console.log(err, res);
                            }
                            cb();
                        });

                    case "Call":
                        monObjectServer.call(request.request, socket, function(err, res) {
                            if (err) {
                                console.log(err, res);
                            }
                            cb();
                        });

                    case "Watch":
                        monObjectServer.watch(request.request, socket, function(err, res) {
                            if (err) {
                                console.log(err, res);
                            }
                            cb();
                        });

                    case "UnWatch":
                        monObjectServer.unWatch(request.request, socket, function(err, res) {
                            if (err) {
                                console.log(err, res);
                            }
                        });

                    default:
                        //unknown command, just continue along
                        cb();
                }

            }, function( err, ret ) {
                //intentionally not returning anything back
            });

        });

        socket.on('Get', function(request) {
            monObjectServer.get(request, socket, function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
        });

        socket.on('Set', function(request) {
            monObjectServer.set(request, socket, function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
        });

        socket.on('Watch', function(request) {
            monObjectServer.watch(request, socket, function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
        });

        socket.on('UnWatch', function(request) {
            monObjectServer.unWatch(request, socket, function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
        });

        socket.on('Call', function(request) {
            monObjectServer.call(request, socket, function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
        });
    });

}
