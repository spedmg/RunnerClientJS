const METHODS = {
  COOKIE: 'cookie',
  OAUTH: 'oauth',
  TOKEN: 'token'
};

class Authentication {
  static set method(authMethod) {
    if (!Object.values(METHODS).includes(authMethod)) {
      throw new Error(`method must be one of: ${Object.values(METHODS)}`);
    }
    this._method = authMethod;
  }

  static get method() {
    return this._method;
  }
}

Object.assign(Authentication, { METHODS });

export { Authentication };
