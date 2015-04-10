'use strict';

function passthrough(originalReq, originalRes, proxyRes){
  console.log(proxyRes.statusCode, 'PASSTHROUGH', originalReq.url);

  originalRes.writeHead(
    proxyRes.statusCode,
    proxyRes.statusMessage,
    proxyRes.headers
  );

  proxyRes.pipe(originalRes);
}

function proxyReponder(porous, originalReq, originalRes) {
  return function proxyRespond(proxyRes) {
    return passthrough(originalReq, originalRes, proxyRes);
  };
}

module.exports = proxyReponder;
