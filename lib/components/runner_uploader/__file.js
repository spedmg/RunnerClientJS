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

var _require = require('../../constants'),
    EVENTS = _require.EVENTS;

var ELEMENT_NAME = 'runner-uploader--file';
var template = document.createElement('template');
template.innerHTML = '\n  <style>\n    :host {\n      border-bottom: 1px solid #ccc;\n      display: flex;\n      justify-content: space-between;\n      align-items: baseline;\n      padding: 8px;\n      position: relative;\n    }\n\n    :host > * {\n      box-sizing: border-box;\n    }\n\n    :host[hidden] {\n      display: none;\n    }\n\n    :host[locked] #remove {\n      display: none;\n    }\n\n    :host #remove {\n      -webkit-appearance: none;\n      background: none;\n      border: none;\n      cursor: pointer;\n      font-size: medium;\n    }\n\n    :host:before,\n    :host:after {\n      visibility: hidden;\n      pointer-events: none;\n    }\n\n    /* Triangle hack */\n    :host:after {\n      position: absolute;\n      top: calc(100% - 5px);\n      left: 20px;\n      margin-left: -5px;\n      width: 0;\n      border-bottom: 5px solid rgba(0,0,0,0.6);\n      border-right: 5px solid transparent;\n      border-left: 5px solid transparent;\n      content: " ";\n      font-size: 0;\n      line-height: 0;\n    }\n\n    :host:before {\n      position: absolute;\n      background-color: rgba(0,0,0,0.6);\n      color: white;\n      content: attr(data-tooltip);\n      padding: 4px 8px;\n      border-radius: 4px;\n      top: 100%;\n      z-index: 3;\n    }\n\n    :host:hover:after,\n    :host:hover:before {\n      visibility: visible;\n    }\n  </style>\n  <slot name="fileName"></slot>\n  <button type="button" id="remove">&times;</button>\n';

// ShadyCSS polyfills scoped styles in browsers that don't support this
// ShadowDOM feature.
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

var RunnerUploader__File = function (_CustomElement2) {
  _inherits(RunnerUploader__File, _CustomElement2);

  _createClass(RunnerUploader__File, null, [{
    key: 'elName',
    get: function get() {
      return ELEMENT_NAME;
    }
  }]);

  function RunnerUploader__File() {
    _classCallCheck(this, RunnerUploader__File);

    var _this = _possibleConstructorReturn(this, (RunnerUploader__File.__proto__ || Object.getPrototypeOf(RunnerUploader__File)).call(this));

    var shadowRoot = _this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    return _this;
  }

  _createClass(RunnerUploader__File, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      var _this2 = this;

      this.shadowRoot.getElementById('remove').addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        _this2.dispatchEvent(new CustomEvent(EVENTS.REMOVE_FILE, {
          bubbles: true,
          detail: { uuid: _this2.dataset.uuid }
        }));
      });
    }
  }, {
    key: 'locked',
    get: function get() {
      return this.hasAttribute('locked');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('locked', '');
      } else {
        this.removeAttribute('locked');
      }
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
    key: 'observedAttributes',
    get: function get() {
      return ['locked'];
    }
  }]);

  return RunnerUploader__File;
}(_CustomElement);

RunnerUploader__File.register();