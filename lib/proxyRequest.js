'use strict';

var http = require('http');
var getRequestOptions = require('./getRequestOptions');
var proxyReponder = require('./proxyReponder');
var handleError = require('./handleError');

function proxyRequest(porous) {
  return function respond(req, res) {
    console.log(req.method, req.url);

    http.request(getRequestOptions(req))
      .on('response', proxyReponder(porous, req, res))
      .on('error', handleError)
      .end();
  };
}

module.exports = proxyRequest;
