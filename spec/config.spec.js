import { Config } from '../src/config';
import { Authentication } from '../src/config/authentication';
import { RUNNER_ENVS, METHODS } from '../src/constants';

describe('Config', () => {
  let subject;

  beforeEach(() => {
    subject = class extends Config {};
  });

  describe('Config.baseURI', () => {
    context('using cookie auth', () => {
      beforeEach(() => {
        spyOnProperty(Authentication, 'method').and.returnValue(METHODS.COOKIE);
      });

      specify(() => {
        expect(subject.baseURI).toBeUndefined();
      });
    });

    context('using token auth', () => {
      beforeEach(() => {
        spyOnProperty(Authentication, 'method').and.returnValue(METHODS.TOKEN);
      });

      context('development', () => {
        it('returns the correct url', () => {
          subject.environment = RUNNER_ENVS.DEVELOPMENT;
          expect(subject.baseURI).toMatch(/localhost:3000/);
        });
      });

      context('integration', () => {
        it('returns the correct url', () => {
          subject.environment = RUNNER_ENVS.INTEGRATION;
          expect(subject.baseURI).toMatch(/integration.sonypicturesrunner.com/);
        });
      });

      context('staging', () => {
        it('returns the correct url', () => {
          subject.environment = RUNNER_ENVS.STAGING;
          expect(subject.baseURI).toMatch(/staging.sonypicturesrunner.com/);
        });
      });

      context('production', () => {
        it('returns the correct url', () => {
          subject.environment = RUNNER_ENVS.PRODUCTION;
          expect(subject.baseURI).toMatch(/sonypicturesrunner.com/);
        });
      });
    });
  });

  describe('Config.environment=', () => {
    it('throws an error if given an invaid env', () => {
      expect(() => { subject.environment = 'foo'; }).toThrow();
    });
  });

  describe('Config.environment', () => {
    it('defaults to production', () => {
      expect(subject.environment).toEqual(RUNNER_ENVS.PRODUCTION);
    });

    it('returns the set env', () => {
      subject.environment = RUNNER_ENVS.STAGING;
      expect(subject.environment).toEqual(RUNNER_ENVS.STAGING);
    });
  });
});
