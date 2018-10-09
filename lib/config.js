'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var values = require('lodash/values');

var _require = require('./config/authentication'),
    Authentication = _require.Authentication;

var _require2 = require('./constants'),
    METHODS = _require2.METHODS,
    RUNNER_ENVS = _require2.RUNNER_ENVS,
    LOG_LEVELS = _require2.LOG_LEVELS;

var translations = require('./translations');

var DEFAULT_LOCALE = 'en';

var Config = function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, [{
    key: 'baseURI',
    get: function get() {
      if (Authentication.method === METHODS.COOKIE) {
        return;
      }

      switch (this.environment) {
        case RUNNER_ENVS.PRODUCTION:
          return 'https://sonypicturesrunner.com';
        case RUNNER_ENVS.STAGING:
          return 'https://staging.sonypicturesrunner.com';
        case RUNNER_ENVS.INTEGRATION:
          return 'https://integration.sonypicturesrunner.com';
        case RUNNER_ENVS.DEVELOPMENT:
          return 'http://localhost:3000';
      }
    }
  }, {
    key: 'environment',
    set: function set(env) {
      var validEnvs = values(RUNNER_ENVS);

      if (!validEnvs.includes(env)) {
        throw new Error('[RunnerClient] Failed to set environment to ' + env + '. Allowed values: ' + validEnvs);
      }
      this._environment = env;
    },
    get: function get() {
      if (!this._environment) {
        return RUNNER_ENVS.PRODUCTION;
      }
      return this._environment;
    }
  }, {
    key: 'locale',
    get: function get() {
      if (!this._locale) {
        this._locale = DEFAULT_LOCALE;
      }
      return this._locale;
    },
    set: function set(val) {
      if (!Object.keys(translations).includes(val)) {
        throw new Error('[RunnerClient] Translations for "' + val + '" are unavailable.');
      }
      this._locale = val;
    }
  }, {
    key: 'logLevel',
    get: function get() {
      if (!this._logLevel) {
        this._logLevel = LOG_LEVELS.WARN;
      }
      return this._logLevel;
    },
    set: function set(level) {
      if (!values(LOG_LEVELS).includes(level)) {
        throw new Error('[RunnerClient] "' + level + '" is an invalid log level.');
      }
      this._logLevel = level;
    }
  }, {
    key: 'logLevelInt',
    get: function get() {
      switch (this.logLevel) {
        case LOG_LEVELS.NONE:
          return 0;
        case LOG_LEVELS.WARN:
          return 1;
        case LOG_LEVELS.INFO:
          return 2;
        case LOG_LEVELS.DEBUG:
          return 3;
      }
    }
  }]);

  return Config;
}();

Object.assign(Config, { Authentication: Authentication });

module.exports = {
  default: Config,
  Config: Config
};