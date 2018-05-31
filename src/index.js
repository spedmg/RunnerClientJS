const packageInfo = require('../package.json');
const Config = require('./config');
const API = require('./api');
const Components = require('./components');

class RunnerClient {
  static get version () {
    return packageInfo.version;
  }
}

Object.assign(RunnerClient, { Config, API, Components });

export { RunnerClient };
export default RunnerClient;
