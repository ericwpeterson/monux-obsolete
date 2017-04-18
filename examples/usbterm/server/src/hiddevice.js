import HID from 'node-hid';
let _ = require('underscore');
import CommandSequencer from './commandseq'

function createBuffer(ascii) {
    var retArr = [];
    _.each(ascii, function(character,key) {
        retArr.push(character.charCodeAt(0));
    });
    return retArr;
};

function formatOutputReport(dataHexArr) {
    var array = [0]
    for ( var i = 0; i < dataHexArr.length; i++ ) {
        array.push(dataHexArr[i]);
    }
    return array;
}


//this function gets called on every buffer read from the usb
//during firmware update process

export default function HidDevice(vid, pid, onRead, onError)  {

    const OUTPUT_REPORT_LEN = 40
    var rBuf= '';
    var terminator = '\r';
    var ignoreReadBytes = true;
    var commandSequencer = new CommandSequencer();
    var hid = new HID.HID(vid,pid);

    var sendAndReceiveHandler;

    hid.on("error", function (err) {
        if ( sendAndReceiveHandler ) {
            sendAndReceiveHandler("");
        };
        onError(err);
    });


    let onData = (data) => {
        if (!ignoreReadBytes) {
            if ( data ) {
                rBuf += data;
            }
            if ( rBuf.indexOf(terminator) > 0 ) {
                rBuf = rBuf.substr(0, rBuf.indexOf(terminator));
                console.log("Read <==========");
                console.log(rBuf);
                ignoreReadBytes = true;
                onRead(rBuf);

                if ( sendAndReceiveTimeout ) {
                    clearTimeout(sendAndReceiveTimeout);
                }

                if ( sendAndReceiveHandler ) {
                    sendAndReceiveHandler(rBuf);
                }
                commandSequencer.onReceive();
            }
        }
    }

    hid.on("data", onData);


    var sendAndReceiveTimeout;


    let _write = (buf) => {
        commandSequencer.requestWrite().then( () => {
            ignoreReadBytes = false;
            var maxBufLength = OUTPUT_REPORT_LEN;
            var dataHexArr;
            var startBit;
            var bufferToSend;

            var numOfChunks = Math.floor(buf.length / OUTPUT_REPORT_LEN);
            var partialChunkLen = buf.length % OUTPUT_REPORT_LEN;
            rBuf = '';

            for (var i = 0; i < numOfChunks; i++) {
                startBit = i*OUTPUT_REPORT_LEN;
                bufferToSend = buf.slice(startBit, startBit+maxBufLength);
                console.log("Writing ==========>");
                console.log(bufferToSend);

                dataHexArr = createBuffer(bufferToSend);
                dataHexArr = formatOutputReport(dataHexArr);
                hid.write(dataHexArr);
            }

            startBit = numOfChunks * maxBufLength;
            bufferToSend = buf.slice(startBit, (startBit + partialChunkLen));


            console.log("Writing ==========>");
            console.log(bufferToSend);

            dataHexArr = createBuffer(bufferToSend);


            dataHexArr = formatOutputReport(dataHexArr);
            hid.write(dataHexArr);
            return;
        });
    }

    let _sendAndReceive = (buf, timeOut) => {
        if ( !timeOut ) timeOut = 2000;
        return new Promise((resolve, reject) => {
            sendAndReceiveHandler = (rBuf) => {
                sendAndReceiveHandler = null;
                resolve(rBuf);
            };

            sendAndReceiveTimeout = setTimeout( ()=> {
                sendAndReceiveTimeout = null;
                onData("TIMED_OUT\r");
            }, timeOut);

            _write(buf);
        });
    };

    return {
        write: (buf) => {
            return _write(buf);
        },
        sendAndReceive: (buf) => {
            return _sendAndReceive(buf);
        }
    }
}
