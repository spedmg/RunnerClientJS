import RunnerClient from '../../src/index';
import { RunnerClientConfiguration } from 'Components/runner_client_config/component';

describe('<runner-client-configuration>', () => {
  let subject;
  let testContainer;

  beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
    spyOn(RunnerClient, 'configure');
  });

  afterEach(() => {
    testContainer.remove();
  });

  describe('on element upgrade', () => {
    let token = 'tokentokentoken';
    let method = 'authMethod';
    let environment = 'test';
    let locale = 'foo';
    let logLevel = 'debug';

    beforeEach(() => {
      testContainer.innerHTML = `
        <${RunnerClientConfiguration.elName}
          token="${token}"
          method="${method}"
          environment="${environment}"
          locale="${locale}"
          log-level="${logLevel}">
        </${RunnerClientConfiguration.elName}>
      `;

      subject = document.querySelector(RunnerClientConfiguration.elName);
    });

    it('configures RunnerClient with given attributes', () => {
      expect(RunnerClient.configure).toHaveBeenCalledWith({
        authentication: {
          method: method,
          token: token,
        },
        environment: environment,
        locale: locale,
        logLevel: logLevel
      });
    });

    it('reflects its attributes via properties', () => {
      expect(subject.token).toEqual(token);
      expect(subject.method).toEqual(method);
      expect(subject.environment).toEqual(environment);
      expect(subject.locale).toEqual(locale);
      expect(subject.logLevel).toEqual(logLevel);
    });

    describe('when a property changes', () => {
      let newLocale = 'bar';

      beforeEach(() => {
        subject.locale = newLocale;
      });

      it('re-configures RunnerClient', () => {
        expect(RunnerClient.configure).toHaveBeenCalledWith({
          authentication: {
            method: method,
            token: token,
          },
          environment: environment,
          locale: newLocale,
          logLevel: logLevel
        });
      });
    });
  });
});
