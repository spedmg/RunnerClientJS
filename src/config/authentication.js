const values = require('lodash/values');
const { METHODS, DEFAULT_HTTP_HEADERS } = require('../constants');
const axios = require('axios');

const ENDPOINT = '/oauth/token';

class Authentication {
  static async authenticate (baseURL, username, password) {
    this._authURL = baseURL + ENDPOINT;
    const response = await axios.post(this._authURL, {
      username,
      password,
      grant_type: 'password',
    }, { headers: DEFAULT_HTTP_HEADERS });
    this.token = response.data.access_token;
    this._refresh_token = response.data.refresh_token;
    this._expiry = response.data.created_at + response.data.expires_in;
  }

  static async refreshToken () {
    const response = await axios.post(this._authURL, {
      refresh_token: this._refresh_token,
      grant_type: 'refresh_token',
    }, { headers: DEFAULT_HTTP_HEADERS });

    this.token = response.data.access_token;
    this._refresh_token = response.data.refresh_token;
    this._expiry = response.data.created_at + response.data.expires_in;
  }

  static set method (authMethod) {
    let validMethods = values(METHODS);
    if (!validMethods.includes(authMethod)) {
      throw new Error(`method must be one of: ${validMethods}`);
    }
    this._method = authMethod;
  }

  static get method() {
    return this._method;
  }

  static set token (token) {
    if (typeof token !== 'string') {
      throw new Error('[RunnerClient] Token must be a string.');
    }
    this._token = token;
  }

  static get token() {
    return this._token;
  }

  static async currentToken () {
    if (this._expiry && this.tokenExpired) {
      await this.refreshToken();
    }
    return this._token;
  }

  static async httpHeaders () {
    switch (this.method) {
    case METHODS.COOKIE:
      return;
    case METHODS.TOKEN:
    case METHODS.OAUTH:
      return { 'Authorization': `Bearer ${await this.currentToken()}` };
    default:
      throw new Error('[RunnerClient] Invalid Configuration.');
    }
  }

  static get tokenExpired () {
    const now = Math.round(Number(new Date()) / 1000);
    return now >= this._expiry;
  }
}

module.exports = { Authentication };
