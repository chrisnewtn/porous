'use strict';

var http = require('http');
var configure = require('./configure');
var proxyRequest = require('./proxyRequest');
var handleError = require('./handleError');
var Middleware = require('./Middleware');

function Porous(config) {
  this.config = configure(config || {});

  this.middlewares = [];

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

Porous.prototype.use = function(middleware) {
  if (middleware instanceof Middleware) {
    return this.middlewares.push(middleware);
  }
  return this.middlewares.push(new Middleware(middleware));
};

module.exports = Porous;
