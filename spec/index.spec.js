import { RunnerClient } from '../src/index';
import { METHODS, RUNNER_ENVS } from '../src/constants';
import { Config } from '../src/config';
import { Authentication } from '../src/config/authentication';
import packageInfo from '../package.json';

const VERSION = packageInfo.version;

describe('RunnerClient', () => {
  let subject;
  let configEnvSpy;
  let authMethodSpy;

  beforeEach(() => {
    subject = class extends RunnerClient {};
    configEnvSpy = spyOnProperty(Config, 'environment', 'set');
    authMethodSpy = spyOnProperty(Authentication, 'method', 'set');
  });

  it('initializes with expected info', () => {
    expect(typeof RunnerClient).toEqual('function');
    expect(RunnerClient.version).toEqual(VERSION);
    [
      'API',
      // 'Config',
      // 'Components'
    ].forEach(submodule => {
      expect(Object.keys(RunnerClient)).toContain(submodule);
    });
  });

  describe('RunnerClient.configure()', () => {
    it('configures the singleton', () => {
      subject.configure({
        environment: RUNNER_ENVS.STAGING,
        authentication: {
          method: METHODS.TOKEN
        }
      });

      expect(configEnvSpy.calls.argsFor(0)[0]).toEqual(RUNNER_ENVS.STAGING);
      expect(authMethodSpy.calls.argsFor(0)[0]).toEqual(METHODS.TOKEN);
    });
  });
});
