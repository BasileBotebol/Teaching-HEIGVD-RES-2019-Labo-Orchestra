const protocol = require('./protocole');
const dgram = require('dgram');
const udp_socket = dgram.createSocket('udp4');
const uuid_ = require('uuid');
const moment = require('moment');


var instrument = process.argv[2];
var sound =protocol.soundByInstrument[instrument];
var uuid = uuid_();
var toSend ={
    "sound":sound,
    "uuid":uuid
};
function emitSound(){
       // var message = new Buffer(toSend);
        var payload = JSON.stringify(toSend);

        udp_socket.send(payload, 0, payload.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function(err, bytes) {
                 if (err) throw err;
             });
    console.log("Sending payload: " + payload + " via port " + protocol.PROTOCOL_PORT);
    }
setInterval(emitSound, 1000);

