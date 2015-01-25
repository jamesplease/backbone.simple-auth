(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'cookies-js'], factory);
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var cookies = require('cookies-js');
    module.exports = factory(Backbone, cookies);
  } else {
    root.<%= exportVarName %> = factory(root.Backbone, root.cookies);
  }
})(this, function(Backbone, cookies) {
  'use strict';

  // @include ./backbone.simple-auth.js

  Backbone.Auth = <%= exportVarName %>;
  
  return <%= exportVarName %>;
});
