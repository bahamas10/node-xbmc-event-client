/**
 * xbmc-event-client
 *
 * XBMC EventServer API Client using UDP sockets
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 11/30/13
 * License: MIT
 */

var dgram = require('dgram');

var c = require('./lib/constants');

// export all Packets
var xec = {
  Packet:             require('./lib/Packet.js'),
  PacketACTION:       require('./lib/PacketACTION.js'),
  PacketBUTTON:       require('./lib/PacketBUTTON.js'),
  PacketBYE:          require('./lib/PacketBYE.js'),
  PacketHELO:         require('./lib/PacketHELO.js'),
  PacketLOG:          require('./lib/PacketLOG.js'),
  PacketMOUSE:        require('./lib/PacketMOUSE.js'),
  PacketNOTIFICATION: require('./lib/PacketNOTIFICATION.js'),
  PacketPING:         require('./lib/PacketPING.js')
};

// export all constants
for (var i in c)
  xec[i] = c[i];

// export the high level object
xec.XBMCEventClient = XBMCEventClient;

// export the `xec` object
module.exports = xec;

///////////////////////////////////
// XBMCEventClient object, used for server communication
///////////////////////////////////
function XBMCEventClient(name, opts) {
  this.name = name;
  this.opts = opts || {};
  this.opts.host = this.opts.host || xec.DEFAULT_HOST;
  this.opts.port = this.opts.port || xec.DEFAULT_PORT;
  this.opts.uid = this.opts.uid || Math.floor(Date.now() / 1000);

  this.client = dgram.createSocket('udp4');
}

// send HELO packet
XBMCEventClient.prototype.connect = function connect(cb) {
  var packet = new xec.PacketHELO(this.opts.uid, this.name, this.opts.icontype, this.opts.iconbuffer);
  this.send(packet, cb);
};

// send PING packet
XBMCEventClient.prototype.ping = function ping(cb) {
  var packet = new xec.PacketPING(this.opts.uid);
  this.send(packet, cb);
};

// send LOG packet
XBMCEventClient.prototype.log = function log(message, loglevel, cb) {
  if (typeof loglevel === 'function') {
    cb = loglevel;
    loglevel = undefined;
  }

  var packet = new xec.PacketLOG(this.opts.uid, message, loglevel);
  this.send(packet, cb);
};

// send NOTIFICATION packet
XBMCEventClient.prototype.notification = function notification(title, message, icontype, iconbuffer, cb) {
  if (typeof icontype === 'function') {
    cb = icontype;
    icontype= undefined;
  }

  icontype = icontype || this.opts.icontype;
  iconbuffer = iconbuffer || this.opts.iconbuffer;

  var packet = new xec.PacketNOTIFICATION(this.opts.uid, title, message, icontype, iconbuffer);
  this.send(packet, cb);
};

// send MOUSE packet
XBMCEventClient.prototype.mouse = function mouse(x, y, cb) {
  var packet = new xec.PacketMOUSE(this.opts.uid, x, y);
  this.send(packet, cb);
};

// send BUTTON packet
XBMCEventClient.prototype.keyPress = function keyPress(name, cb) {
  return this.buttonPress('KB', name, cb);
};

XBMCEventClient.prototype.keyDown = function keyDown(name, cb) {
  return this.buttonDown('KB', name, cb);
};

XBMCEventClient.prototype.keyUp = function keyUp(name, cb) {
  return this.buttonUp('KB', name, cb);
};

XBMCEventClient.prototype.remotePress = function remotePress(name, cb) {
  return this.buttonPress('R1', name, cb);
};

XBMCEventClient.prototype.remoteDown = function remoteDown(name, cb) {
  return this.buttonDown('R1', name, cb);
};

XBMCEventClient.prototype.remoteUp = function remoteUp(name, cb) {
  return this.buttonUp('R1', name, cb);
};

XBMCEventClient.prototype.buttonPress = function buttonPress(map, button, cb) {
  return this.buttonState({map: map, button: button, down: true, repeat: false, amount: 0}, cb);
};

XBMCEventClient.prototype.buttonDown = function buttonDown(map, button, cb) {
  return this.buttonState({map: map, button: button, down: true, amount: 0}, cb);
};

XBMCEventClient.prototype.buttonUp = function buttonUp(map, button, cb) {
  return this.buttonState({map: map, button: button, down: false, amount: 0}, cb);
};

XBMCEventClient.prototype.releaseAll = function releaseAll(cb) {
  var packet = new xec.PacketBUTTON(this.opts.uid, {code: 0x01, down: false});
  this.send(packet, cb);
};

XBMCEventClient.prototype.buttonState = function buttonState(state, cb) {
  var packet = new xec.PacketBUTTON(this.opts.uid, state);
  this.send(packet, cb);
};

// close the socket
XBMCEventClient.prototype.disconnect = function disconnect(cb) {
  var self = this;
  cb = cb || function() {};

  var packet = new xec.PacketBYE(this.opts.uid);

  this.send(packet, function(errors, bytes) {
    self.client.close();
    cb(errors, bytes);
  });
};
XBMCEventClient.prototype.close = XBMCEventClient.prototype.disconnect;

// send a Packet over the socket
XBMCEventClient.prototype.send = function send(packet, cb) {
  var self = this;
  cb = cb || function() {};

  if (this.opts.log)
    console.error('xec :: sending %s packet', packet.constructor.name);

  var errors = [];
  var bytes = [];
  var packets = packet.getPackets();
  packets.forEach(function(message) {
    self.client.send(message, 0, message.length, self.opts.port, self.opts.host, function(err, byte) {
      if (err)
        errors.push(err);
      else
        bytes.push(byte);
      if (errors.length + bytes.length === packets.length)
        return cb(errors, bytes);
    });
  });
};
