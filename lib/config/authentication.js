'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var values = require('lodash/values');

var _require = require('../constants'),
    METHODS = _require.METHODS,
    DEFAULT_HTTP_HEADERS = _require.DEFAULT_HTTP_HEADERS;

var axios = require('axios');

var ENDPOINT = '/oauth/token';

var Authentication = function () {
  function Authentication() {
    _classCallCheck(this, Authentication);
  }

  _createClass(Authentication, null, [{
    key: 'authenticate',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(baseURL, username, password) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._authURL = baseURL + ENDPOINT;
                _context.next = 3;
                return axios.post(this._authURL, {
                  username: username,
                  password: password,
                  grant_type: 'password'
                }, { headers: DEFAULT_HTTP_HEADERS });

              case 3:
                response = _context.sent;

                this.token = response.data.access_token;
                this._refresh_token = response.data.refresh_token;
                this._expiry = response.data.created_at + response.data.expires_in;

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function authenticate(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return authenticate;
    }()
  }, {
    key: 'refreshToken',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return axios.post(this._authURL, {
                  refresh_token: this._refresh_token,
                  grant_type: 'refresh_token'
                }, { headers: DEFAULT_HTTP_HEADERS });

              case 2:
                response = _context2.sent;


                this.token = response.data.access_token;
                this._refresh_token = response.data.refresh_token;
                this._expiry = response.data.created_at + response.data.expires_in;

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function refreshToken() {
        return _ref2.apply(this, arguments);
      }

      return refreshToken;
    }()
  }, {
    key: 'currentToken',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this._expiry && this.tokenExpired)) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return this.refreshToken();

              case 3:
                return _context3.abrupt('return', this._token);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function currentToken() {
        return _ref3.apply(this, arguments);
      }

      return currentToken;
    }()
  }, {
    key: 'httpHeaders',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.t0 = this.method;
                _context4.next = _context4.t0 === METHODS.COOKIE ? 3 : _context4.t0 === METHODS.TOKEN ? 4 : _context4.t0 === METHODS.OAUTH ? 4 : 9;
                break;

              case 3:
                return _context4.abrupt('return');

              case 4:
                _context4.next = 6;
                return this.currentToken();

              case 6:
                _context4.t1 = _context4.sent;
                _context4.t2 = 'Bearer ' + _context4.t1;
                return _context4.abrupt('return', {
                  'Authorization': _context4.t2
                });

              case 9:
                throw new Error('[RunnerClient] Invalid Configuration.');

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function httpHeaders() {
        return _ref4.apply(this, arguments);
      }

      return httpHeaders;
    }()
  }, {
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
    key: 'tokenExpired',
    get: function get() {
      var now = Math.round(Number(new Date()) / 1000);
      return now >= this._expiry;
    }
  }]);

  return Authentication;
}();

module.exports = { Authentication: Authentication };