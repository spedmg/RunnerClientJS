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
}

Object.assign(RunnerClient, { Config, API, EVENTS, LOG_LEVELS, METHODS, RUNNER_ENVS });

module.exports = {
  default: RunnerClient,
  RunnerClient
};
