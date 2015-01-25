# backbone.simple-auth
[![Travis build status](http://img.shields.io/travis/jmeas/backbone.simple-auth.svg?style=flat)](https://travis-ci.org/jmeas/backbone.simple-auth)
[![Code Climate](https://codeclimate.com/github/jmeas/backbone.simple-auth/badges/gpa.svg)](https://codeclimate.com/github/jmeas/backbone.simple-auth)
[![Test Coverage](https://codeclimate.com/github/jmeas/backbone.simple-auth/badges/coverage.svg)](https://codeclimate.com/github/jmeas/backbone.simple-auth)
[![Dependency Status](https://david-dm.org/jmeas/backbone.simple-auth.svg)](https://david-dm.org/jmeas/backbone.simple-auth) 
[![devDependency Status](https://david-dm.org/jmeas/backbone.simple-auth/dev-status.svg)](https://david-dm.org/jmeas/backbone.simple-auth#info=devDependencies)

A basic cookie-based client-side auth service for Backbone apps.

### Motivation

Some client-side apps wish to send a token, stored in a cookie, along with each request to
an API under the Authorization header. This library manages that for you.

It also provides a central location for your app to determine if the user is authenticated
or not.

### When should I use this library?

- Your application stores authenticated user tokens in cookies
- Your API follows the [Bearer Token spec](https://tools.ietf.org/html/rfc6750#section-2.1)
  for the Authorization header. Github's API
  [is an example](https://developer.github.com/v3/oauth/#use-the-access-token-to-access-the-api)
  of an API that accepts this format.

### Dependencies

Other than Backbone (and `Backbone.$`), this library depends on
[Cookies](https://github.com/ScottHamper/Cookies). Don't worry – it's only 1kb.

### Basic Usage

Your server should be configured to set the authentication token as a cookie. When that
happens, and your app loads...

```js
// Load up the module
var Auth = require('backbone.simple-auth');

// Create a new instance of auth. If the cookie with the given
// name exists, then `auth` will set the value of the `Authorization` HEADER
// for future AJAX requests to be `Bearer COOKIE_VALUE`
auth = new Auth({
  cookieName: 'user-token'
});

// Returns true if the cookie exists
auth.get('authenticated');

// Get the token
auth.get('token');

// Destroy the cookie
auth.logout();
```

That's all there is to it.

### Attributes

Auth is a Backbone Model. As such, you can use the Model API when interacting with it.
There are three attributes on Auth:

##### `cookieName`

The name of the cookie to search for the token on. Defaults to `token`.

##### `authenticated`

A boolean representing whether or not the user is authenticated. Defaults to `false`.

##### `token`

The value of the token. Defaults to `undefined`.

### API

##### `determineAuth()`

Searches for a cookie with the same name as `auth.get('cookieName')`. If it exists,
then its value is assumed to be the token, and the user is set to be authorized.

This is called when `auth` is first created. You may also wish to call it later if
your application allows for logging in on the client.

If the cookie is found, the `authenticated` event is triggered.

##### `logout()`

If the user is logged in, then the cookie will be destroyed. The value of `authenticated` is
set to false, and the value of `token` is set to `undefined`. Lastly, the `logout` event is
triggered.

### Events

##### `authenticate`

The user has logged in. Called when `auth` is first loaded. The value of the `token` is passed
as the first argument.

##### `logout`

The user has been logged out.

### FAQ

#### How do I log the user in from the client?

This library does not handle creation of cookies containing auth tokens, because there are so many
ways to accomplish such a task. You will need to build your own system to generate the token. Once
you've done that, and you can generate a token for authenticated users, then you must set it as the
cookie. Once that is done, call `auth.determineAuth()` to notify the `auth` model that the user is
logged in.

### Contributing

#### Unit tests

**In Node**

Run `gulp` to execute the test suite in Node.

**In the browser**

Run `gulp test:browser` to start a server for testing in the browser. Once you've
done that, navigate to `http://localhost:7777/test/runner.html`.

### Building the library

`gulp build`
