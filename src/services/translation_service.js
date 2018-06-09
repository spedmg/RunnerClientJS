import I18n from 'i18n-js';
import { Config } from '../config';
import translations from '../translations.js';

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

export { TranslationService };
