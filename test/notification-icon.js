var fs = require('fs');
var path = require('path');
var util = require('util');

var xec = require('../');

var name = util.format('node - %s', path.basename(__filename));
var opts = {
  log: true,
  icontype: xec.ICON_PNG,
  iconbuffer: fs.readFileSync(path.join(__dirname, '../lib/node.png')),
  host: process.env.XBMC_HOST,
  port: process.env.XBMC_PORT
};

var xbmcclient = new xec.XBMCEventClient(name, opts);

xbmcclient.connect(function(errors, bytes) {
  if (errors.length)
    throw errors[0];
  console.log(bytes);

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
