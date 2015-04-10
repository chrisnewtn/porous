'use strict';

var url = require('url');

function getRequestOptions(request) {
  var requestUrl = url.parse(request.url);

  return {
    method: request.method,
    hostname: requestUrl.hostname,
    port: requestUrl.port,
    path: requestUrl.path,
    auth: requestUrl.auth,
    headers: request.headers
  };
}

module.exports = getRequestOptions;
