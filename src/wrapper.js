(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    module.exports = factory(Backbone);
  } else {
    root.<%= exportVarName %> = factory(root.Backbone);
  }
})(this, function(Backbone) {
  'use strict';

  // @include ./backbone.simple-auth.js

  Backbone.Auth = <%= exportVarName %>;
  
  return <%= exportVarName %>;
});
