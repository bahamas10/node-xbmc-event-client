var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketBYE;

////////////////////////
// BYE Packet
////////////////////////
util.inherits(PacketBYE, Packet);
function PacketBYE(uid) {
  this.type = c.PT_BYE;
  this.uid = uid;
  this.payload = new Buffer(0);
}
