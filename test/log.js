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

  var message = util.format('log from pid %d on %s', process.pid, new Date());
  console.log('the following message should appear in xbmc.log');
  console.log(message);
  xbmcclient.log(message, function(errors, bytes) {
    if (errors.length)
      throw errors[0];
    xbmcclient.close();
  });
});
