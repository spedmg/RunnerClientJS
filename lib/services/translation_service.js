'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var I18n = require('i18n-js');

var _require = require('../config'),
    Config = _require.Config;

var translations = require('../translations.js');

var TranslationService = function () {
  function TranslationService() {
    _classCallCheck(this, TranslationService);
  }

  _createClass(TranslationService, null, [{
    key: 'translate',
    value: function translate() {
      var _i18n;

      if (!this.i18n) {
        this._configureI18n();
      }
      return (_i18n = this.i18n).t.apply(_i18n, arguments);
    }
  }, {
    key: '_configureI18n',
    value: function _configureI18n() {
      I18n.translations = translations;
      I18n.locale = Config.locale;
      this.i18n = I18n;
    }
  }]);

  return TranslationService;
}();

module.exports = { TranslationService: TranslationService };