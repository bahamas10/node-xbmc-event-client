var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketHELO;

////////////////////////
// HELO Packet
////////////////////////
util.inherits(PacketHELO, Packet);
function PacketHELO(uid, name, icontype, iconbuffer) {
  this.type = c.PT_HELO;
  this.name = name || '';
  this.uid = uid;

  name = (this.name + '\0').substr(0, 128);
  icontype = icontype || c.ICON_NONE;
  iconbuffer = iconbuffer || new Buffer(0);

  var payload = new Buffer(Buffer.byteLength(name) + 1 + 2 + 4 + 4 + iconbuffer.length);

  var i = 0;
  i += payload.write(name, i);
  payload.writeInt8(icontype, i); i += 1; // icon type
  payload.writeUInt16BE(0, i);    i += 2; // port no
  payload.writeUInt32BE(0, i);    i += 4; // reserved1
  payload.writeUInt32BE(0, i);    i += 4; // reserved2

  iconbuffer.copy(payload, i);

  this.payload = payload;
}
