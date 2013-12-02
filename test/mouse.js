var path = require('path');
var util = require('util');

var name = util.format('node - %s', path.basename(__filename));
var opts = {
  host: process.env.XBMC_HOST,
  port: process.env.XBMC_PORT
};

var XBMCEventClient = require('../').XBMCEventClient;

var xbmcclient = new XBMCEventClient(name, opts);

xbmcclient.connect(function(errors, bytes) {
  if (errors.length)
    throw errors[0];

  console.log('the mouse should move to the center of the screen in XBMC');
  xbmcclient.mouse(65536 / 2, 65536 / 2, function(errors, bytes) {
    if (errors.length)
      throw errors[0];
    xbmcclient.close();
  });
});
