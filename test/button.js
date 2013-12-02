var path = require('path');
var util = require('util');

var name = util.format('node - %s', path.basename(__filename));
var opts = {
  log: true,
  host: process.env.XBMC_HOST,
  port: process.env.XBMC_PORT
};

var XBMCEventClient = require('../').XBMCEventClient;

var xbmcclient = new XBMCEventClient(name, opts);

xbmcclient.connect(function(errors, bytes) {
  if (errors.length)
    throw errors[0];

  console.log('the up button should be pressed in XBMC');
  xbmcclient.keyPress('up', function(errors, bytes) {
    if (errors.length)
      throw errors[0];
    setTimeout(function() {
      xbmcclient.close();
    }, 1000);
  });
});
