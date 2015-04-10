'use strict';

var http = require('http');
var configure = require('./configure');
var proxyRequest = require('./proxyRequest');
var handleError = require('./handleError');

function Porous(config) {
  this.config = configure(config || {});

  this.server = http.createServer()
    .on('request', proxyRequest(this))
    .on('error', handleError);
}

Porous.prototype.listen = function(port, hostname) {
  port = port || this.config.port;
  hostname = hostname || this.config.hostname;

  return this.server.listen(port, hostname, function onListen(error){
    if (error) {
      return handleError(error);
    }
    console.log('Porous listening on', hostname + ':' + port);
  });
};

module.exports = Porous;
