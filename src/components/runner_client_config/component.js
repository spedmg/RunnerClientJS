const { RunnerClient } = require('../../index');
const ELEMENT_NAME = 'runner-client-configuration';

class RunnerClientConfiguration extends HTMLElement {
  static get elName() { return ELEMENT_NAME; }

  static get observedAttributes() {
    return [
      'token',
      'method',
      'environment',
      'locale',
      'logLevel'
    ];
  }

  connectedCallback() {
    this.configureClient();
  }

  configureClient() {
    RunnerClient.configure({
      authentication: {
        method: this.method,
        token: this.token,
      },
      environment: this.environment,
      locale: this.locale,
      logLevel: this.logLevel
    });
  }

  get method() {
    return this.getAttribute('method');
  }

  set method(val) {
    if (val) {
      this.setAttribute('method', val);
    } else {
      this.removeAttribute('method');
    }
    this.configureClient();
  }

  get token() {
    return this.getAttribute('token');
  }

  set token(val) {
    if (val) {
      this.setAttribute('token', val);
    } else {
      this.removeAttribute('token');
    }
    this.configureClient();
  }

  get environment() {
    return this.getAttribute('environment');
  }

  set environment(val) {
    if (val) {
      this.setAttribute('environment', val);
    } else {
      this.removeAttribute('environment');
    }
    this.configureClient();
  }

  get locale() {
    return this.getAttribute('locale');
  }

  set locale(val) {
    if (val) {
      this.setAttribute('locale', val);
    } else {
      this.removeAttribute('locale');
    }
    this.configureClient();
  }

  get logLevel() {
    return this.getAttribute('log-level');
  }

  set logLevel(val) {
    if (val) {
      this.setAttribute('log-level', val);
    } else {
      this.removeAttribute('log-level');
    }
    this.configureClient();
  }

  static register() {
    // Register the custom element to the DOM
    window.customElements.define(
      this.elName,
      this
    );
  }
}

RunnerClientConfiguration.register();

module.exports = { RunnerClientConfiguration };
