import { Authentication } from '../../src/config/authentication';

describe('Authentication', () => {
  describe('method', () => {
    it('persists the set method', () => {
      Authentication.method = Authentication.METHODS.COOKIE;

      expect(Authentication.method).toEqual(Authentication.METHODS.COOKIE);
    });

    it('prevents invalid methods from being set', () => {
      expect(() => { Authentication.method = 'foo'; }).toThrow();
    });
  });
});
