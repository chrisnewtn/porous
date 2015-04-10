'use strict';

var Porous = require('./lib/Porous');

function createPorous(config) {
  return new Porous(config);
}

module.exports = createPorous;
