import { Authentication } from './config/authentication';
import { METHODS, RUNNER_ENVS } from './constants';
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
    let validEnvs = Object.values(RUNNER_ENVS);

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
      throw new Error(`[RunnerClient] Translations for ${val} are unavailable. Contact Runner support for help.`);
    }
    this._locale = val;
  }
}

Object.assign(Config, { Authentication });

export { Config };
export default Config;
