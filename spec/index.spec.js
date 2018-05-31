import RunnerClient from '../src/index';
import packageInfo from '../package.json';

const VERSION = packageInfo.version;

describe('RunnerClient', () => {
  it('initializes with expected info', () => {
    expect(typeof RunnerClient).toEqual('function');
    expect(RunnerClient.version).toEqual(VERSION);
    ['API', 'Config', 'Components'].forEach(submodule => {
      expect(Object.keys(RunnerClient)).toContain(submodule);
    });
  });
});
