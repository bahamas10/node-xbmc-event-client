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

  var title = util.format('node %s', process.version);
  var message = util.format('test from pid %d on %s', process.pid, new Date());
  console.log('the following notification should appear in XBMC');
  console.log('%s :: %s', title, message);
  xbmcclient.notification(title, message, function(errors, bytes) {
    if (errors.length)
      throw errors[0];
    xbmcclient.close();
  });
});
