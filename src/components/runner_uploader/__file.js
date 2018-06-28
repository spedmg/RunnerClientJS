const { EVENTS } = require('../../constants');
const ELEMENT_NAME = 'runner-uploader--file';
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 8px;
      position: relative;
    }

    :host > * {
      box-sizing: border-box;
    }

    :host[hidden] {
      display: none;
    }

    :host[locked] #remove {
      display: none;
    }

    :host #remove {
      -webkit-appearance: none;
      background: none;
      border: none;
      cursor: pointer;
      font-size: medium;
    }

    :host:before,
    :host:after {
      visibility: hidden;
      pointer-events: none;
    }

    /* Triangle hack */
    :host:after {
      position: absolute;
      top: calc(100% - 5px);
      left: 20px;
      margin-left: -5px;
      width: 0;
      border-bottom: 5px solid rgba(0,0,0,0.6);
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      content: " ";
      font-size: 0;
      line-height: 0;
    }

    :host:before {
      position: absolute;
      background-color: rgba(0,0,0,0.6);
      color: white;
      content: attr(data-tooltip);
      padding: 4px 8px;
      border-radius: 4px;
      top: 100%;
      z-index: 3;
    }

    :host:hover:after,
    :host:hover:before {
      visibility: visible;
    }
  </style>
  <slot name="fileName"></slot>
  <button type="button" id="remove">&times;</button>
`;

// ShadyCSS polyfills scoped styles in browsers that don't support this
// ShadowDOM feature.
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

class RunnerUploader__File extends HTMLElement {
  static get elName() { return ELEMENT_NAME; }

  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.getElementById('remove').addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      this.dispatchEvent(
        new CustomEvent(EVENTS.REMOVE_FILE, {
          bubbles: true,
          detail: { uuid: this.dataset.uuid }
        })
      );
    });
  }

  static get observedAttributes() {
    return ['locked'];
  }

  get locked() {
    return this.hasAttribute('locked');
  }

  set locked(val) {
    if (val) {
      this.setAttribute('locked', '');
    } else {
      this.removeAttribute('locked');
    }
  }

  static register() {
    // Register the custom element to the DOM
    if (!window.customElements.get(this.elName)) {
      window.customElements.define(
        this.elName,
        this
      );
    }
  }
}

RunnerUploader__File.register();
