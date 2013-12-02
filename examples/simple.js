var XBMCEventClient = require('../').XBMCEventClient;
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
