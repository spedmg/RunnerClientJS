'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var values = require('lodash/values');

var _require = require('../constants'),
    METHODS = _require.METHODS;

var Authentication = function () {
  function Authentication() {
    _classCallCheck(this, Authentication);
  }

  _createClass(Authentication, null, [{
    key: 'method',
    set: function set(authMethod) {
      var validMethods = values(METHODS);
      if (!validMethods.includes(authMethod)) {
        throw new Error('method must be one of: ' + validMethods);
      }
      this._method = authMethod;
    },
    get: function get() {
      return this._method;
    }
  }, {
    key: 'token',
    set: function set(token) {
      if (typeof token !== 'string') {
        throw new Error('[RunnerClient] Token must be a string.');
      }
      this._token = token;
    },
    get: function get() {
      return this._token;
    }
  }, {
    key: 'httpHeaders',
    get: function get() {
      switch (this.method) {
        case METHODS.COOKIE:
          return;
        case METHODS.TOKEN:
        case METHODS.OAUTH:
          return { 'Authorization': 'Bearer ' + this.token };
        default:
          throw new Error('[RunnerClient] Invalid Configuration.');
      }
    }
  }]);

  return Authentication;
}();

module.exports = { Authentication: Authentication };