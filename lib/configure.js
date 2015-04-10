'use strict';

var objectAssign = require('object-assign');

var defaultConfig = {
  hostname: '127.0.0.1',
  port: 8888
};

module.exports = function configure(config){
  return objectAssign({}, defaultConfig, config);
};
