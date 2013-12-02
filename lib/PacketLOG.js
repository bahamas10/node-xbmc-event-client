var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketLOG;

////////////////////////
// LOG Packet
////////////////////////
util.inherits(PacketLOG, Packet);
function PacketLOG(uid, message, loglevel) {
  this.type = c.PT_LOG;
  this.uid = uid;

  loglevel = loglevel || c.LOGDEBUG;
  message += '\0';

  var payload = new Buffer(1 + Buffer.byteLength(message));

  var i = 0;
  payload.writeInt8(loglevel, i); i += 1;
  payload.write(message, i);

  this.payload = payload;
}
