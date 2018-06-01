import { Config } from '../config';
import { Authentication } from '../config/authentication';
import axios from 'axios';

class RestAction {
  static post(endpoint, data) {
    return this.http.post(
      endpoint,
      data
    );
  }

  static get http() {
    if (!this._axios) {
      this._axios = axios.create({
        baseUrl: Config.baseURI,
        headers: Authentication.httpHeaders
      });
    }
    return this._axios;
  }
}

export { RestAction };
