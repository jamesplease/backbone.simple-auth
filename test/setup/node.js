var setup = require('./setup');
var config = require('../../config');

// Set up JSDom
global.jsdom = require('jsdom').jsdom;
global.document = global.jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.XMLHttpRequest = global.window.XMLHttpRequest;

// Fix for an issue with JSDom, where setting a cookie as "undefined"
// sets it as a string, and not `undefined`
// For more: https://github.com/ScottHamper/Cookies/issues/37
var cookies = require('cookies-js');
var originalGet = cookies.get;
cookies.get = function(cookieName) {
  var value = originalGet(cookieName);
  return value === 'undefined' ? undefined : value;
};

var $ = require('jquery');
$.support.cors = true;

global[config.exportVarName] = require('../../src/' + config.entryFileName);
global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
setup();
