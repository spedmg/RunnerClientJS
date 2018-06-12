import values from 'lodash/values';
import { METHODS } from '../constants';

class Authentication {
  static set method(authMethod) {
    let validMethods = values(METHODS);
    if (!validMethods.includes(authMethod)) {
      throw new Error(`method must be one of: ${validMethods}`);
    }
    this._method = authMethod;
  }

  static get method() {
    return this._method;
  }

  static set token(token) {
    if (typeof token !== 'string') {
      throw new Error('[RunnerClient] Token must be a string.');
    }
    this._token = token;
  }

  static get token() {
    return this._token;
  }

  static get httpHeaders() {
    switch (this.method) {
    case METHODS.COOKIE:
      return;
    case METHODS.TOKEN:
    case METHODS.OAUTH:
      return { 'Authorization': `Bearer ${this.token}` };
    default:
      throw new Error('[RunnerClient] Invalid Configuration.');
    }
  }
}

export { Authentication };
