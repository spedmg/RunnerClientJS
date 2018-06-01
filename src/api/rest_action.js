import { DEFAULT_HTTP_HEADERS } from '../constants';
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
        baseURL: Config.baseURI,
        headers: Object.assign({}, DEFAULT_HTTP_HEADERS, Authentication.httpHeaders)
      });
    }
    return this._axios;
  }
}

export { RestAction };
