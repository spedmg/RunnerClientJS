const packageInfo = require('../package.json');
const { API } = require('./api');
const { Config } = require('./config');
const { METHODS, RUNNER_ENVS } = require('./constants');

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
  }
}

Object.assign(RunnerClient, { API, METHODS, RUNNER_ENVS });

module.exports = {
  default: RunnerClient,
  RunnerClient
};
