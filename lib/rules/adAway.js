'use strict';

module.exports = {
  name: 'Ad Away',
  direction: 'request',
  matchUrl: [
    '*.googleadservices.com/*',
    '*.doubleclick.net/*',
    '*.googlesyndication.com/*'
  ],
  matchType: ['*/*', 'text/javascript', 'application/javascript'],
  handler: function(req, res) {
    res.writeHead(410, {'content-type': 'text/plain'});
    res.end('Resource blocked.');
  }
};
