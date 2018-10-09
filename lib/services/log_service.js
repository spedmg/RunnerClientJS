'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-console: "off" */
var _require = require('../config'),
    Config = _require.Config;

var LogService = function () {
  function LogService() {
    _classCallCheck(this, LogService);
  }

  _createClass(LogService, null, [{
    key: 'info',
    value: function info() {
      if (Config.logLevelInt >= 2) {
        var _console;

        (_console = console).info.apply(_console, arguments);
      }
    }
  }, {
    key: 'warn',
    value: function warn() {
      if (Config.logLevelInt >= 1) {
        var _console2;

        (_console2 = console).warn.apply(_console2, arguments);
      }
    }
  }, {
    key: 'debug',
    value: function debug() {
      if (Config.logLevelInt >= 3) {
        var _console3;

        (_console3 = console).log.apply(_console3, arguments);
      }
    }
  }]);

  return LogService;
}();

module.exports = { LogService: LogService };