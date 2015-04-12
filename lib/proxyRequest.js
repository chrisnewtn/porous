'use strict';

var http = require('http');
var getRequestOptions = require('./getRequestOptions');
var proxyResponder = require('./proxyResponder');
var handleError = require('./handleError');

function sendProxyRequest(porous, req, res) {
  http.request(getRequestOptions(req))
    .on('response', proxyResponder(porous, req, res))
    .on('error', handleError)
    .end();
}

function enforceRules(rules, req, res, done){
  function next(){
    enforceRules(rules, req, res, done);
  }

  var rule = rules.shift();

  if (rule) {
    return rule.handle(req, res, next);
  }
  done();
}

function proxyRequest(porous) {
  return function respond(req, res) {
    console.log(req.method, req.url);

    var requestRules = porous.getApplicableRequestRules(req.url, req.headers.accept);

    if (!requestRules.length) {
      return sendProxyRequest(porous, req, res);
    }

    enforceRules(requestRules, req, res, function onEnforced(){
      sendProxyRequest(porous, req, res);
    });
  };
}

module.exports = proxyRequest;
