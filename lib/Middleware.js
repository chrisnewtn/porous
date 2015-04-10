'use strict';

var Pattern = require('url-pattern');

function parsePattern(patternString) {
  return new Pattern(patternString);
}

function callHandler(handlers, req, res, done){
  function next(){
    callHandler(handlers, req, res, done);
  }

  var handler = handlers.shift();

  if (handler) {
    return handler(req, res, next);
  }
  done();
}

function Middleware(rules) {
  var patterns = Object.keys(rules);

  this.matchPatterns = patterns.map(parsePattern);
  this.handlers = patterns.map(function(patternKey){
    return rules[patternKey];
  });
}

Middleware.prototype.handle = function(req, res, next) {
  var allHandlers = this.handlers;

  function matchUrl(matchedHandlers, pattern, index) {
    var matches = pattern.match(req.url);

    if (matches) {
      matchedHandlers.push(allHandlers[index]);
    }

    return matchedHandlers;
  }

  var matchedHandlers = this.matchPatterns.reduce(matchUrl, []);

  if (matchedHandlers.length > 0) {
    return callHandler(matchedHandlers, req, res, next);
  }
  next();
};

module.exports = Middleware;
