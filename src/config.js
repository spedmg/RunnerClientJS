import values from 'lodash/values';
import { Authentication } from './config/authentication';
import { METHODS, RUNNER_ENVS, LOG_LEVELS } from './constants';
import translations from './translations';

const DEFAULT_LOCALE = 'en';

class Config {
  static get baseURI() {
    if (Authentication.method === METHODS.COOKIE ) { return; }

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

  static set environment(env) {
    let validEnvs = values(RUNNER_ENVS);

    if (!validEnvs.includes(env)) {
      throw new Error(`[RunnerClient] Failed to set environment to ${env}. Allowed values: ${validEnvs}`);
    }
    this._environment = env;
  }

  static get environment() {
    if (!this._environment) {
      return RUNNER_ENVS.PRODUCTION;
    }
    return this._environment;
  }

  static get locale() {
    if (!this._locale) {
      this._locale = DEFAULT_LOCALE;
    }
    return this._locale;
  }

  static set locale(val) {
    if (!Object.keys(translations).includes(val)) {
      throw new Error(`[RunnerClient] Translations for "${val}" are unavailable.`);
    }
    this._locale = val;
  }

  static get logLevel() {
    if (!this._logLevel) { this._logLevel = LOG_LEVELS.WARN; }
    return this._logLevel;
  }

  static set logLevel(level) {
    if (!values(LOG_LEVELS).includes(level)) {
      throw new Error(`[RunnerClient] "${level}" is an invalid log level.`);
    }
    this._logLevel = level;
  }

  static get logLevelInt() {
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
}

Object.assign(Config, { Authentication });

export { Config };
export default Config;
