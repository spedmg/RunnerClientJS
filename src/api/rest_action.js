const { DEFAULT_HTTP_HEADERS } = require('../constants');
const { Config } = require('../config');
const { Authentication } = require('../config/authentication');
const axios = require('axios');

class RestAction {
  static get(endpoint, config) {
    return this.http.get(endpoint, config);
  }

  static patch(endpoint, data) {
    return this.http.patch(endpoint, data);
  }

  static post(endpoint, data) {
    return this.http.post(endpoint, data);
  }

  static get http() {
    if (!this._axios) {
      this._axios = axios.create({
        baseURL: Config.baseURI,
        headers: Object.assign({}, DEFAULT_HTTP_HEADERS, Authentication.httpHeaders)
      });
    }
    return this._axios;
  }
}

module.exports = { RestAction };
