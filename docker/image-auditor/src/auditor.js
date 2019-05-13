const protocol = require('./protocole');
const dgram = require('dgram');
const udp_socket = dgram.createSocket('udp4');
const net = require('net'); 
const moment = require('moment');

var server = net.createServer();
server.on('connection', client_tcp_connection);
server.listen(2205);
server.on('error', function (err) {
    console.log(err);
}); 

var mapMusician = new Map();

function client_tcp_connection(socket) {
    var musicians = new Array();

    mapMusician.forEach(function (value, key) {
        var activeMusician = {
            uuid: key,
            instrument:value["instrument"],
            activeSince: value["activeSince"]
        };
        musicians.push(activeMusician);

    });
    var payload = JSON.stringify(musicians);
    socket.write(payload + '\n');
    socket.end();
}


udp_socket.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group : " + protocol.PROTOCOL_MULTICAST_ADDRESS + ":" + protocol.PROTOCOL_PORT);
    udp_socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

udp_socket.on('message', function(msg, source) {
    var musician = JSON.parse(msg);
    var uuid = musician["uuid"];
    var sound = musician["sound"];
    for (var key in protocol.soundByInstrument){
        if(protocol.soundByInstrument[key] == sound){
            var instrument = key;
        }
    }

    if(mapMusician.has(uuid)) {
        mapMusician.get(uuid)["activeSince"] = moment().format();
    } else {
        mapMusician.set(uuid, {"instrument": instrument, "activeSince": moment().format()});
    }
});

function checkActivity() {
    mapMusician.forEach(function (value, key) {
        var lastActivity = value["activeSince"];
        var timeLastHeard = moment(moment().format()).diff(moment(lastActivity), 'second');
        if (timeLastHeard > 5) {
            mapMusician.delete(key);
        }
    });
}

setInterval(checkActivity, 1000);

