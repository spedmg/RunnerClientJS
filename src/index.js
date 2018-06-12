import packageInfo from '../package.json';
import { API } from './api';
import Config from './config';
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
  }

  static importComponents() {
    return import(/* webpackChunkName: 'components' */ './components');
  }
}

Object.assign(RunnerClient, { API, METHODS, RUNNER_ENVS });

export { RunnerClient };
export default RunnerClient;
