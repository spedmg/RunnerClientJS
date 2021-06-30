const { DEFAULT_HTTP_HEADERS } = require('../constants');
const { Config } = require('../config');
const { Authentication } = require('../config/authentication');
const axios = require('axios');

class RestAction {
  static async get(endpoint, config) {
    const http = await this.http();
    return http.get(endpoint, config);
  }

  static async patch(endpoint, data) {
    const http = await this.http();
    return http.patch(endpoint, data);
  }

  static async post(endpoint, data) {
    const http = await this.http();
    return http.post(endpoint, data);
    // return fetch(Config.baseURI + endpoint, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   credentials: 'same-origin',
    //   mode: 'cors',
    //   headers: new Headers([
    //     [ 'Content-Type', 'application/json' ],
    //     [ 'Accept', 'application/json' ],
    //     [ 'Authorization', `Bearer ${Authentication.token}` ]
    //   ])
    // }).then(
    //   response => { return response.json(); },
    //   error => { console.warn(error); }
    // );
  }

  static async http() {
    const authHeaders = await Authentication.httpHeaders();

    return axios.create({
      baseURL: Config.baseURI,
      headers: Object.assign({}, DEFAULT_HTTP_HEADERS, authHeaders)
    });
  }
}

module.exports = { RestAction };
