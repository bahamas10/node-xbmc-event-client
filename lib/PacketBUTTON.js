var util = require('util');

var c = require('./constants');
var Packet = require('./Packet');

module.exports = PacketBUTTON;

////////////////////////
// BUTTON Packet
////////////////////////
util.inherits(PacketBUTTON, Packet);
function PacketBUTTON(uid, opts) {
  this.type = c.PT_BUTTON;
  this.uid = uid;

  opts = opts || {};
  var code = opts.code || 0;
  var down = typeof opts.down === 'boolean' ? opts.down : true;
  var queue = typeof opts.queue === 'boolean' ? opts.queue : false;
  var repeat = typeof opts.repeat === 'boolean' ? opts.repeat : true;
  var amount = 0;
  if (typeof opts.amount === 'number') {
    amount = Math.max(Math.min(opts.amount, 65535), 0);
  }

  var flags = 0;

  if (opts.map && opts.button) {
    flags |= c.BT_USE_NAME;
    code = 0;
  }

  if (typeof amount === 'number')
    flags |= c.BT_USE_AMOUNT;
  if (down)
    flags |= c.BT_DOWN;
  else
    flags |= c.BT_UP;
  if (!repeat)
    flags |= c.BT_NO_REPEAT;
  if (queue)
    flags |= c.BT_QUEUE;
  if (opts.axis === 1)
    flags |= c.BT_AXISSINGLE;
  else if (opts.axis === 2)
    flags |= c.BT_AXIS;

  var map = (opts.map || '') + '\0';
  var button = (opts.button || '') + '\0';

  var payload = new Buffer(2 + 2 + 2 + Buffer.byteLength(map) + Buffer.byteLength(button));

  var i = 0;
  payload.writeUInt16BE(code, i);   i += 2;
  payload.writeUInt16BE(flags, i);  i += 2;
  payload.writeUInt16BE(amount, i); i += 2;
  i += payload.write(map, i);
  i += payload.write(button, i);

  this.payload = payload;
}
