'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _CustomElement() {
  return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}

;
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);
var RunnerClient = require('../../index');
var ELEMENT_NAME = 'runner-client-configuration';

var RunnerClientConfiguration = function (_CustomElement2) {
  _inherits(RunnerClientConfiguration, _CustomElement2);

  function RunnerClientConfiguration() {
    _classCallCheck(this, RunnerClientConfiguration);

    return _possibleConstructorReturn(this, (RunnerClientConfiguration.__proto__ || Object.getPrototypeOf(RunnerClientConfiguration)).apply(this, arguments));
  }

  _createClass(RunnerClientConfiguration, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.configureClient();
    }
  }, {
    key: 'configureClient',
    value: function configureClient() {
      RunnerClient.configure({
        authentication: {
          method: this.method,
          token: this.token
        },
        environment: this.environment,
        locale: this.locale,
        logLevel: this.logLevel
      });
    }
  }, {
    key: 'method',
    get: function get() {
      return this.getAttribute('method');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('method', val);
      } else {
        this.removeAttribute('method');
      }
      this.configureClient();
    }
  }, {
    key: 'token',
    get: function get() {
      return this.getAttribute('token');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('token', val);
      } else {
        this.removeAttribute('token');
      }
      this.configureClient();
    }
  }, {
    key: 'environment',
    get: function get() {
      return this.getAttribute('environment');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('environment', val);
      } else {
        this.removeAttribute('environment');
      }
      this.configureClient();
    }
  }, {
    key: 'locale',
    get: function get() {
      return this.getAttribute('locale');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('locale', val);
      } else {
        this.removeAttribute('locale');
      }
      this.configureClient();
    }
  }, {
    key: 'logLevel',
    get: function get() {
      return this.getAttribute('log-level');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('log-level', val);
      } else {
        this.removeAttribute('log-level');
      }
      this.configureClient();
    }
  }], [{
    key: 'register',
    value: function register() {
      // Register the custom element to the DOM
      if (!window.customElements.get(this.elName)) {
        window.customElements.define(this.elName, this);
      }
    }
  }, {
    key: 'elName',
    get: function get() {
      return ELEMENT_NAME;
    }
  }, {
    key: 'observedAttributes',
    get: function get() {
      return ['token', 'method', 'environment', 'locale', 'logLevel'];
    }
  }]);

  return RunnerClientConfiguration;
}(_CustomElement);

RunnerClientConfiguration.register();

module.exports = { RunnerClientConfiguration: RunnerClientConfiguration };