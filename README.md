Node.JS XBMCEventClient
=======================

XBMC EventServer API Client using UDP sockets

Usage
-----

### Simple

``` js
var XBMCEventClient = require('xbmc-event-client').XBMCEventClient;
var xbmc = new XBMCEventClient('node.js app');

xbmc.connect(function(errors, bytes) {
  if (errors.length)
    throw errors[0];

  xbmc.notification('Title', 'Hello from node!');
  xbmc.keyPress('enter');
  xbmc.log('this will show up in xbmc.log');

  setTimeout(function() {
    xbmc.close();
  }, 1000);
});
```

### Advanced

``` js
var fs = require('fs');
var path = require('path');

var xec = require('xbmc-event-client');

var opts = {
  log: true,
  icontype: xec.ICON_PNG,
  iconbuffer: fs.readFileSync('./node.png'),
  host: '192.168.1.50',
  port: 9777
};

var xbmc = new xec.XBMCEventClient(name, opts);

xbmc.connect(function(errors, bytes) {
  if (errors.length)
    throw errors[0];

  xbmc.notification(title, message, function(errors, bytes) {
    if (errors.length)
      throw errors[0];

    xbmc.close();
  });
});
```

API
---

Use the high-level `XBMCEventClient` API for easy XBMC communication

### `new XBMCEventClient(name, opts={})`

Create a new `XBMCEventClient` object.

- `name`: used to identify the client to XBMC, sent in the `HELO` packet
- `opts` [optional]
  - `opts.host`: XBMC host to connect to, defaults to `localhost`
  - `opts.port`: XBMC port to connect to, defaults to `9777`
  - `opts.log`: log sent packet notifications to stderr, defaults to `false`
  - `opts.iconbuffer`: optional buffer of icon data to send for notificationss
  - `opts.icontype`: optional icon type if `opts.iconbuffer` is supplied, see
  [constants.js](/lib/constants.js) for possible values

---

All functions below take a callback function as their last argument.  The callback
will be fired when all UDP packets have been sent to the server, and will
be passed 2 arguments.

``` js
function(errors, bytes) {}
```

The firest argument is an array of `new Error` objects (if any errors happened),
and the second is an array of the bytes sent to the server.  Checking the length
of `errors` is sufficient for determining if an error occurred when sending the
packet(s).

---

### `xbmc.connect(cb=function() {})`

Connect to XBMC by sending a `HELO` packet

- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.ping(cb=function() {})`

Keep the "connection" alive by sending a `PING` packet.
Note that a conncection is considered idle after 60 seconds
of inactivity, so consider adding an interval to continually ping
the server.

``` js
setInterval(xbmc.ping.bind(xbmc), 55 * 1000);
```

- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.log(message, loglevel=xec.LOGDEBUG, cb=function() {})`

Log a message on XBMC to `xbmc.log`

- `message`: the message to log on the server
- `loglevel`: [optional] the log level to use, see [constants.js](/lib/constants.js) for possible values
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.notification(title, message, icontype=undefined, iconbuffer=undefined, cb=function() {})`

Send an OSD notification to XBMC

- `title`: title of the notification
- `message`: message in the notification
- `icontype`: [optional] icon type if `iconbuffer` is supplied, see [constants.js](/lib/constants.js) for possible values
- `iconbuffer`: [optional] buffer of icon data to send for notificationss
- `cb`: [optional] callback function to fire when all packets are sent

If `icontype` and `iconbuffer` were given in the constructor, they will be used
automatically for this function.

### `xbmc.mouse(x, y, cb=function() {})`

Set the mouse position to the given X and Y positions

- `x`: mouse X position, 0 <= `x` <= 65535
- `y`: mouse Y position, 0 <= `y` <= 65535
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.keyPress(name, cb=function() {})`

Trigger a single key press event using the keyboard keymap

- `name`: keyname name, like `enter`, `up`, `escape`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.keyDown(name, cb=function() {})`

Set the state of a key to down

- `name`: keyname name, like `enter`, `up`, `escape`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.keyUp(name, cb=function() {})`

Set the state of a key to up

- `name`: keyname name, like `enter`, `up`, `escape`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.remotePress(name, cb=function() {})`

Trigger a single remote press event using the remote keymap

- `name`: keyname name, like `play`, `menu`, `left`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.remoteDown(name, cb=function() {})`

Set the state of a remote key to down

- `name`: keyname name, like `play`, `menu`, `left`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.remoteUp(name, cb=function() {})`

Set the state of a remote key to up

- `name`: keyname name, like `play`, `menu`, `left`, etc.
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.buttonPress(map, button, cb=function() {})`

Trigger a single press event for the `button` found in keymap `map`

- `map`: keymap file
- `button`: button name
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.buttonDown(map, button, cb=function() {})`

Set the state for the `button` found in keymap `map` to down

- `map`: keymap file
- `button`: button name
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.buttonUp(map, button, cb=function() {})`

Set the state for the `button` found in keymap `map` to up

- `map`: keymap file
- `button`: button name
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.releaseAll(cb=function() {})`

Release all buttons pressed (set the state of all buttons to up)

- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.buttonState(state, cb=function() {})`

Set button state

- `state`:
  - `state.map`: [string] keymap to use, defaults to `undefined`
  - `state.button`: [string] button name if `state.map` is set, defaults to `undefined`
  - `state.code`: [int] button code, defaults to `undefined`
  - `state.down`: [boolean] the button is pushed down, defaults to `true`
  - `state.queue`: [boolean] queue is specified, defaults to `false`
  - `state.repeat`: [boolean] the button should repeat, defaults to `true`
  - `state.amount`: [int] amount button is pushed, 0 <= `amount` <= 65535, defaults to `0`
  - `state.axis`: [int] number of axis, defaults to `0`
- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.disconnect(cb=function() {})`

Send a `BYE` packet to the server and close the underlying UDP socket

- `cb`: [optional] callback function to fire when all packets are sent

### `xbmc.send(packet, cb=function() {})`

Internal function used for sending a `new Packet()` object to XBMC

- `cb`: [optional] callback function to fire when all packets are sent

Low Level API
-------------

Also exposed in this module is the generic `Packet` class, as well as
the specific subclasses like `PacketHELO`, `PacketBUTTON`, `PacketPING`, etc.
classes.

For more information on these classes and how to use them see the [lib/](/lib/)
directory

Installation
------------

    npm install xbmc-event-client

Tests
-----

Run `npm test` to run the tests, using environmental variables to account
for your environment, ex.

    $ XBMC_HOST=192.168.1.2 npm test

License
-------

MIT
