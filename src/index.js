import packageInfo from '../package.json';
import Components from './components';
import Config from './config';
import API from './api';
import { METHODS, RUNNER_ENVS } from './constants';

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
    Components.register();
  }
}

Object.assign(RunnerClient, { API, Components, METHODS, RUNNER_ENVS });


export { RunnerClient };
export default RunnerClient;
