import { METHODS } from '../../src/constants';
import { Authentication } from '../../src/config/authentication';

describe('Authentication', () => {
  let subject;

  beforeEach(() => {
    subject = class extends Authentication {};
  });

  describe('method =', () => {
    it('persists the set method', () => {
      subject.method = METHODS.COOKIE;
      expect(subject.method).toEqual(METHODS.COOKIE);
    });

    it('prevents invalid methods from being set', () => {
      expect(() => { subject.method = 'foo'; }).toThrow();
    });
  });

  describe('token =', () => {
    it('persists the set token', () => {
      subject.token = 'foo';

      expect(subject.token).toEqual('foo');
    });

    it('ensures the token is a string', () => {
      expect(() => { subject.token = 123; }).toThrow();
      expect(() => { subject.token = { a: 'b'}; }).toThrow();
      expect(() => { subject.token = undefined; }).toThrow();
      expect(() => { subject.token = NaN; }).toThrow();
      expect(() => { subject.token = []; }).toThrow();
    });
  });

  describe('httpHeaders', () => {
    context('cookie method', () => {
      beforeEach(() => {
        subject.method = METHODS.COOKIE;
      });

      // For Runner UI exclusively.
      // No additional headers needed as long as cookie is present.
      specify(async () => {
        expect(await subject.httpHeaders()).toBeUndefined();
      });
    });

    context('token method', () => {
      beforeEach(() => {
        subject.method = METHODS.TOKEN;
        subject.token  = 'runnerApiAuthToken';
      });

      specify(async () => {
        expect(await subject.httpHeaders()).toEqual({ 'Authorization': 'Bearer runnerApiAuthToken' });
      });
    });

    context('oauth method', () => {
      beforeEach(() => {
        subject.method = METHODS.OAUTH;
        subject.token  = 'runnerApiAuthToken';
      });

      specify(async () => {
        expect(await subject.httpHeaders()).toEqual({ 'Authorization': 'Bearer runnerApiAuthToken' });
      });
    });
  });
});
