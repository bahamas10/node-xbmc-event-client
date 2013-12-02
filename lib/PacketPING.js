var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketPING;

////////////////////////
// PING Packet
////////////////////////
util.inherits(PacketPING, Packet);
function PacketPING(uid) {
  this.type = c.PT_PING;
  this.uid = uid;
  this.payload = new Buffer(0);
}
