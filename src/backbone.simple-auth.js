import Backbone from 'backbone';
import cookies from 'cookies-js';

class SimpleAuth extends Backbone.Model {
  get defaults() {
    return {
      cookieName: 'token',
      token: undefined,
      authenticated: false
    };
  }

  constructor() {
    super(...arguments);
    this.determineAuth();
    this._configureAjax();
  }

  // Determine if we're authenticated based on the cookie
  determineAuth() {
    var token = cookies.get(this.get('cookieName'));
    // Fix for a bug in cookies-js:
    // https://github.com/ScottHamper/Cookies/issues/37
    if (token === 'undefined') { token = undefined; }
    this.set({
      authenticated: !!token,
      token: token
    });
    if (!token) { return; }
    this.trigger('authenticate', this.get('token'));
  }

  // Log us out by destroying the token
  logout() {
    cookies.expire(this.get('cookieName'));
    this.set({
      token: undefined,
      authenticated: false
    });
    this.trigger('logout');
  }

  // Include our token in every request
  _configureAjax() {
    var auth = this;
    Backbone.$.ajaxSetup({
      beforeSend(jqXHR) {
        if (auth.get('authenticated')) {
          jqXHR.setRequestHeader('Authorization', 'Bearer ' + auth.get('token'));
        }
        return true;
      }
    });
  }
}

export default SimpleAuth;
