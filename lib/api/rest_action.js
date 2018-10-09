'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../constants'),
    DEFAULT_HTTP_HEADERS = _require.DEFAULT_HTTP_HEADERS;

var _require2 = require('../config'),
    Config = _require2.Config;

var _require3 = require('../config/authentication'),
    Authentication = _require3.Authentication;

var axios = require('axios');

var RestAction = function () {
  function RestAction() {
    _classCallCheck(this, RestAction);
  }

  _createClass(RestAction, null, [{
    key: 'get',
    value: function get(endpoint, config) {
      return this.http.get(endpoint, config);
    }
  }, {
    key: 'patch',
    value: function patch(endpoint, data) {
      return this.http.patch(endpoint, data);
    }
  }, {
    key: 'post',
    value: function post(endpoint, data) {
      return this.http.post(endpoint, data);
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
  }, {
    key: 'http',
    get: function get() {
      if (!this._axios) {
        this._axios = axios.create({
          baseURL: Config.baseURI,
          headers: Object.assign({}, DEFAULT_HTTP_HEADERS, Authentication.httpHeaders)
        });
      }
      return this._axios;
    }
  }]);

  return RestAction;
}();

module.exports = { RestAction: RestAction };