'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var packageInfo = require('../package.json');

var _require = require('./api'),
    API = _require.API;

var _require2 = require('./config'),
    Config = _require2.Config;

var _require3 = require('./constants'),
    EVENTS = _require3.EVENTS,
    LOG_LEVELS = _require3.LOG_LEVELS,
    METHODS = _require3.METHODS,
    RUNNER_ENVS = _require3.RUNNER_ENVS;

var RunnerClient = function () {
  function RunnerClient() {
    _classCallCheck(this, RunnerClient);
  }

  _createClass(RunnerClient, null, [{
    key: 'configure',
    value: function configure(options) {
      if (options.environment) {
        Config.environment = options.environment;
      }
      if (options.authentication) {
        var _options$authenticati = options.authentication,
            method = _options$authenticati.method,
            token = _options$authenticati.token;


        if (method) {
          Config.Authentication.method = method;
        }
        if (token) {
          Config.Authentication.token = token;
        }
      }
      if (options.locale) {
        Config.locale = options.locale;
      }
      if (options.logLevel) {
        Config.logLevel = options.logLevel;
      }
    }
  }, {
    key: 'loadComponents',
    value: function loadComponents() {
      return new Promise(function (resolve) {
        if (!window.Element.prototype.prepend || !window.Array.prototype.includes || !window.Array.prototype.find || !window.Array.prototype.from || !window.Array.prototype.findIndex) {
          import( /* webpackChunkName: "polyfill" */'./polyfill.js').then(resolve);
        } else {
          resolve();
        }
      }).then(function () {
        return import( /* webpackChunkName: "components" */'./components');
      });
    }
  }, {
    key: 'version',
    get: function get() {
      return packageInfo.version;
    }
  }]);

  return RunnerClient;
}();

Object.assign(RunnerClient, { Config: Config, API: API, EVENTS: EVENTS, LOG_LEVELS: LOG_LEVELS, METHODS: METHODS, RUNNER_ENVS: RUNNER_ENVS });

module.exports = RunnerClient;