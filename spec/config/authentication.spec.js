import { METHODS } from '../../src/constants';
import { Authentication } from '../../src/config/authentication';

describe('Authentication', () => {
  describe('method', () => {
    it('persists the set method', () => {
      Authentication.method = METHODS.COOKIE;
      expect(Authentication.method).toEqual(METHODS.COOKIE);
    });

    it('prevents invalid methods from being set', () => {
      expect(() => { Authentication.method = 'foo'; }).toThrow();
    });
  });
});
