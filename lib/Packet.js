var c = require('./constants');

module.exports = Packet;

///////////////////////////////////
// Generic XBMC EventServer packet
///////////////////////////////////
function Packet(type, payload, uid) {
  this.type = type;
  this.payload = payload || new Buffer(0);
  this.uid = uid || Math.floor(Date.now() / 1000);
}

// return the number of packets needed for the given payload
Packet.prototype.packetsNeeded = function packetsNeeded() {
  if (!this.payload.length)
    return 1;
  return Math.ceil(this.payload.length / c.MAX_PAYLOAD_SIZE);
};

// return an array of buffers to send
Packet.prototype.getPackets = function getPackets() {
  var needed = this.packetsNeeded();
  var packets = [];
  for (var i = 1; i <= needed; i++) {
    var payloadlength = Math.min(this.payload.length - (c.MAX_PAYLOAD_SIZE * (i - 1)), c.MAX_PAYLOAD_SIZE);
    var packetlength = payloadlength + c.HEADER_SIZE;

    var packet = new Buffer(packetlength);

    var start = (i - 1) * c.MAX_PAYLOAD_SIZE;
    var end = start + payloadlength;
    var payload = this.payload.slice(start, end);

    var j = this._getHeader(i, needed, payloadlength).copy(packet);
    payload.copy(packet, j);

    packets.push(packet);
  }
  return packets;
};

// return the 32 bit header as a buffer
Packet.prototype._getHeader = function getHeader(seq, max, payloadlength) {
  var message = new Buffer(c.HEADER_SIZE);

  var i = 0;
  i += message.write(c.SIGNATURE, i);
  message.writeInt8(c.MAJOR, i);           i += 1;
  message.writeInt8(c.MINOR, i);           i += 1;
  message.writeUInt16BE(this.type, i);     i += 2;
  message.writeUInt32BE(seq, i);           i += 4;
  message.writeUInt32BE(max, i);           i += 4;
  message.writeUInt16BE(payloadlength, i); i += 2;
  message.writeUInt32BE(this.uid, i);      i += 4;
  message.fill(0, i, i + 10);              i += 10; // reserved

  return message;
};
