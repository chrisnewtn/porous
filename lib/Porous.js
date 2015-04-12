'use strict';

var http = require('http');
var configure = require('./configure');
var proxyRequest = require('./proxyRequest');
var handleError = require('./handleError');
var Rule = require('./Rule');

function Porous(config) {
  this.config = configure(config || {});

  this.requestRules = [];
  this.responseRules = [];

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

Porous.prototype.use = function(rule) {
  var ruleToUse = rule instanceof Rule ? rule : new Rule(rule);

  if (ruleToUse.direction === 'request') {
    return this.requestRules.push(ruleToUse);
  }
  return this.responseRules.push(ruleToUse);
};

Porous.prototype.getApplicableRequestRules = function(url, contentType) {
  return this.requestRules.filter(function checkRule(rule) {
    return rule.isApplicable(url, contentType);
  });
};

Porous.prototype.getApplicableResponseRules = function(url, contentType) {
  return this.responseRules.filter(function checkRule(rule) {
    return rule.isApplicable(url, contentType);
  });
};

module.exports = Porous;
