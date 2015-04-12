'use strict';

var zlib = require('zlib');
var handleError = require('./handleError');

function passthrough(originalReq, originalRes, proxyRes){
  console.log(proxyRes.statusCode, 'PASSTHROUGH', originalReq.url);

  originalRes.writeHead(
    proxyRes.statusCode,
    proxyRes.statusMessage,
    proxyRes.headers
  );

  proxyRes.pipe(originalRes);
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

function ableToAlter(proxyRes){
  return proxyRes.headers['content-type'] &&
    proxyRes.headers['content-type'].indexOf('text/html') !== -1;
}

function getResponder(responseRules, originalReq, originalRes, proxyRes) {
  function respond(){
    console.log(proxyRes.statusCode, originalReq.url);

    var headers = proxyRes.headers;
    headers['content-encoding'] = 'utf8';
    headers['content-length'] = Buffer.byteLength(proxyRes.body, 'utf8');

    originalRes.writeHead(proxyRes.statusCode, proxyRes.statusMessage, headers);
    originalRes.end(proxyRes.body, 'utf8');
  }

  return function responder() {
    enforceRules(responseRules, originalReq, proxyRes, respond);
  };
}

function proxyResponder(porous, originalReq, originalRes) {
  return function proxyRespond(proxyRes) {
    var responseRules = porous.getApplicableResponseRules(
      originalReq.url,
      originalReq.headers['content-type']
    );

    if (!responseRules.length) {
      return passthrough(originalReq, originalRes, proxyRes);
    }

    proxyRes.body = '';

    function concatChunk(chunk) {
      proxyRes.body += chunk;
    }

    if(proxyRes.headers['content-encoding'] === 'gzip'){
      var gunzip = zlib.createGunzip();
      proxyRes.pipe(gunzip);

      gunzip
        .on('data', concatChunk)
        .on('error', handleError)
        .on('end', getResponder(responseRules, originalReq, originalRes, proxyRes));
    } else {
      proxyRes
        .on('data', concatChunk)
        .on('error', handleError)
        .on('end', getResponder(responseRules, originalReq, originalRes, proxyRes));
    }
  };
}

module.exports = proxyResponder;
