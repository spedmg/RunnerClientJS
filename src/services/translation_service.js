const I18n = require('i18n-js');
const { Config } = require('../config');
const translations = require('../translations.js').default;

class TranslationService {
  static translate(...args) {
    if (!this.i18n) {
      this._configureI18n();
    }
    return this.i18n.t(...args);
  }

  static _configureI18n() {
    I18n.translations = translations;
    I18n.locale = Config.locale;
    this.i18n = I18n;
  }
}

module.exports = { TranslationService };
