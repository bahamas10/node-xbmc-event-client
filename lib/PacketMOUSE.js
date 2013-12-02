var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketMOUSE;

////////////////////////
// MOUSE Packet
////////////////////////
util.inherits(PacketMOUSE, Packet);
function PacketMOUSE(uid, x, y) {
  this.type = c.PT_MOUSE;
  this.uid = uid;

  var payload = new Buffer(1 + 2 + 2);

  var i = 0;
  payload.writeInt8(c.MS_ABSOLUTE, i); i += 1;
  payload.writeUInt16BE(x, i);         i += 2;
  payload.writeUInt16BE(y, i);         i += 2;

  this.payload = payload;
}
