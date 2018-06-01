import packageInfo from '../package.json';
import Config from './config';
import API from './api';
import Components from './components';
import { METHODS, RUNNER_ENVS } from './constants';

class RunnerClient {
  static get version () {
    return packageInfo.version;
  }

  static configure(options) {
    if (options.environment) { Config.environment = options.environment; }
    if (options.authentication && options.authentication.method) {
      Config.Authentication.method = options.authentication.method;
      // TODO: Auth Token & OAuth parameters
    }
  }
}

// Object.assign(RunnerClient, { Config, API, Components });
Object.assign(RunnerClient, { API, METHODS, RUNNER_ENVS });

export { RunnerClient };
export default RunnerClient;
