const packageInfo = require('../package.json');
const { API } = require('./api');
const { Config } = require('./config');
const { EVENTS, LOG_LEVELS, METHODS, RUNNER_ENVS } = require('./constants');

class RunnerClient {
  static get version () {
    return packageInfo.version;
  }

  static configure(options) {
    if (options.environment) { Config.environment = options.environment; }
    if (options.authentication) {
      let { method, token } = options.authentication;

      if (method) { Config.Authentication.method = method; }
      if (token) { Config.Authentication.token = token; }
    }
    if (options.locale) { Config.locale = options.locale; }
    if (options.logLevel) { Config.logLevel = options.logLevel; }
  }

  static loadComponents() {
    return new Promise((resolve) => {
      if (!window.Element.prototype.prepend ||
          !window.Array.prototype.includes ||
          !window.Array.prototype.find ||
          !window.Array.prototype.from ||
          !window.Array.prototype.findIndex) {
        import(/* webpackChunkName: "polyfill" */ './polyfill.js').then(resolve);
      } else {
        resolve();
      }
    }).then(() => {
      return import(/* webpackChunkName: "components" */ './components');
    });
  }
}

Object.assign(RunnerClient, { Config, API, EVENTS, LOG_LEVELS, METHODS, RUNNER_ENVS });

module.exports = RunnerClient;
