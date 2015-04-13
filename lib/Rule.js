'use strict';

var Pattern = require('url-pattern');

function patternify(urlPatternString) {
  return new Pattern(urlPatternString);
}

function setupRule(rule, options) {
  rule.name = options.name;
  rule.direction = options.direction;

  if (Array.isArray(options.matchUrl)) {
    rule.url = options.matchUrl.map(patternify);
  } else {
    rule.url = [new Pattern(options.matchUrl)];
  }

  if (Array.isArray(options.matchType)) {
    rule.type = options.matchType;
  } else {
    rule.type = [options.matchType];
  }

  rule.handler = options.handler;
}

function Rule(options) {
  setupRule(this, options || {});
}

Rule.prototype.isApplicable = function(url, contentType) {
  url = url || '';
  contentType = contentType || '';

  var urlMatch = this.url.some(function matchUrl(urlToMatch) {
    return !!urlToMatch.match(url);
  });

  if (!urlMatch) {
    return false;
  }
  return this.type.some(function containsType(applicableType){
    return contentType.indexOf(applicableType) !== -1;
  });
};

Rule.prototype.handle = function(req, res, next) {
  return this.handler.call(this, req, res, next);
};

module.exports = Rule;
