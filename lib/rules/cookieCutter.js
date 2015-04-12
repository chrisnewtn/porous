'use strict';

module.exports = {
  name: 'Cookie Cutter',
  direction: 'request',
  matchUrl: '*/wp-content/plugins/eu-cookie-directive/script.js',
  matchType: ['*/*', 'text/javascript', 'application/javascript'],
  handler: function(req, res) {
    res.writeHead(410, {'content-type': 'text/plain'});
    res.end('Resource blocked.');
  }
};
