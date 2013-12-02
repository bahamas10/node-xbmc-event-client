var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketNOTIFICATION;

////////////////////////
// NOTIFICATION Packet
////////////////////////
util.inherits(PacketNOTIFICATION, Packet);
function PacketNOTIFICATION(uid, title, message, icontype, iconbuffer) {
  this.type = c.PT_NOTIFICATION;
  this.uid = uid;

  title += '\0';
  message += '\0';
  icontype = icontype || c.ICON_NONE;
  iconbuffer = iconbuffer || new Buffer(0);

  var payload = new Buffer(Buffer.byteLength(title) + Buffer.byteLength(message) + 1 + 4 + iconbuffer.length);

  var i = 0;
  i += payload.write(title, i);
  i += payload.write(message, i);
  payload.writeInt8(icontype, i); i += 1; // icon type
  payload.writeUInt32BE(0, i);    i += 4; // reserved

  iconbuffer.copy(payload, i);

  this.payload = payload;
}
