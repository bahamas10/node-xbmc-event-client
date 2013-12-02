var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketACTION;

////////////////////////
// ACTION Packet
////////////////////////
util.inherits(PacketACTION, Packet);
function PacketACTION(uid, message, type) {
  this.type = c.PT_ACTION;
  this.uid = uid;

  type = type || c.ACTION_EXECBUILTIN;
  message += '\0';

  var payload = new Buffer(1 + Buffer.byteLength(message));

  var i = 0;
  payload.writeInt8(type, i); i += 1;
  payload.write(message, i);

  this.payload = payload;
}
