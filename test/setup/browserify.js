var setup = require('./setup');
var config = require('../../config');

// global.chai = require('chai');
// global.sinon = require('sinon');
// global.chai.use(require('sinon-chai'));
global[config.exportVarName] = require('../../tmp/__entry');
global.mocha.setup('bdd');

global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mochaGlobals);
  global.mocha.run();
  setup();
};
