'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../constants'),
    DEFAULT_HTTP_HEADERS = _require.DEFAULT_HTTP_HEADERS;

var _require2 = require('../config'),
    Config = _require2.Config;

var _require3 = require('../config/authentication'),
    Authentication = _require3.Authentication;

var axios = require('axios');

var RestAction = function () {
  function RestAction() {
    _classCallCheck(this, RestAction);
  }

  _createClass(RestAction, null, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(endpoint, config) {
        var http;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.http();

              case 2:
                http = _context.sent;
                return _context.abrupt('return', http.get(endpoint, config));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'patch',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(endpoint, data) {
        var http;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.http();

              case 2:
                http = _context2.sent;
                return _context2.abrupt('return', http.patch(endpoint, data));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function patch(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return patch;
    }()
  }, {
    key: 'post',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(endpoint, data) {
        var http;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.http();

              case 2:
                http = _context3.sent;
                return _context3.abrupt('return', http.post(endpoint, data));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function post(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: 'http',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var authHeaders;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return Authentication.httpHeaders();

              case 2:
                authHeaders = _context4.sent;
                return _context4.abrupt('return', axios.create({
                  baseURL: Config.baseURI,
                  headers: Object.assign({}, DEFAULT_HTTP_HEADERS, authHeaders)
                }));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function http() {
        return _ref4.apply(this, arguments);
      }

      return http;
    }()
  }]);

  return RestAction;
}();

module.exports = { RestAction: RestAction };