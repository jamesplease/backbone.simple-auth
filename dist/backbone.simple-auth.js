var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["backbone", "cookies-js"], factory);
  } else if (typeof exports !== "undefined") {
    var Backbone = require("backbone");
    var cookies = require("cookies-js");
    module.exports = factory(Backbone, cookies);
  } else {
    root.SimpleAuth = factory(root.Backbone, root.cookies);
  }
})(this, function (Backbone, cookies) {
  "use strict";

  var SimpleAuth = (function (_Backbone$Model) {
    function SimpleAuth() {
      _get(Object.getPrototypeOf(SimpleAuth.prototype), "constructor", this).apply(this, arguments);
      this.determineAuth();
      this._configureAjax();
    }

    _inherits(SimpleAuth, _Backbone$Model);

    _prototypeProperties(SimpleAuth, null, {
      defaults: {
        get: function () {
          return {
            cookieName: "token",
            token: undefined,
            authenticated: false
          };
        },
        enumerable: true,
        configurable: true
      },
      determineAuth: {

        // Determine if we're authenticated based on the cookie
        value: function determineAuth() {
          var token = cookies.get(this.get("cookieName"));
          // Fix for a bug in cookies-js:
          // https://github.com/ScottHamper/Cookies/issues/37
          if (token === "undefined") {
            token = undefined;
          }
          this.set({
            authenticated: !!token,
            token: token
          });
          if (!token) {
            return;
          }
          this.trigger("authenticate", this.get("token"));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      logout: {

        // Log us out by destroying the token
        value: function logout() {
          cookies.expire(this.get("cookieName"));
          this.set({
            token: undefined,
            authenticated: false
          });
          this.trigger("logout");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      _configureAjax: {

        // Include our token in every request
        value: function ConfigureAjax() {
          var auth = this;
          Backbone.$.ajaxSetup({
            beforeSend: function beforeSend(jqXHR) {
              if (auth.get("authenticated")) {
                jqXHR.setRequestHeader("Authorization", "Bearer " + auth.get("token"));
              }
              return true;
            }
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return SimpleAuth;
  })(Backbone.Model);




  Backbone.Auth = SimpleAuth;

  return SimpleAuth;
});
//# sourceMappingURL=backbone.simple-auth.js.map