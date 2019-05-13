const protocol = require('../protocole');
const dgram = require('dgram');
const udp_socket = dgram.createSocket('udp4');
const uuid = require('uuid');
const moment = require('moment');


var instrument = process.argv[2];
var sound =protocol.soundByInstrument[instrument];
var uuid = uuid();
var toSend ={
    "sound":sound,
    "uuid":uuid
};
function emitSound(){
        var message = new Buffer(toSend);
        var payload = JSON.stringify(message);

        udp_socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function(err, bytes) {
                 if (err) throw err;
             });
    console.log("Sending payload: " + payload + " via port " + udp_socket.address().port);
    }
setInterval(emitSound, 1000);

