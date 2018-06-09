import ShadyCSS from 'shadycss';
import { TranslationService } from 'Services/translation_service';
const ELEMENT_NAME = 'spe-file-drop--incoming';
const TRANSLATION_SCOPE = { scope: 'SPEFileDrop.Incoming' };
const t = (key) => {
  return TranslationService.translate(key, TRANSLATION_SCOPE);
};

const tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style>
    :host {
      align-items: center;
      display: none;
      height: 100%;
      justify-content: center;
      position: absolute;
      width: 100%;
    }

    :host[incoming] {
      display: flex;
    }
  </style>
  <h1>${t('headingText')}</h1>
`;
ShadyCSS.prepareTemplate(tmpl, ELEMENT_NAME);

class SPEFileDrop__Incoming extends HTMLElement {
  static get elName() { return ELEMENT_NAME; }

  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['incoming'];
  }

  get incoming() {
    return this.hasAttribute('incoming');
  }

  set incoming(val) {
    if (val) {
      this.setAttribute('incoming', '');
    } else {
      this.removeAttrinute('incoming');
    }
  }

  static register(window) {
    // Register the custom element to the DOM
    if (window && window.customElements) {
      window.customElements.define(
        this.elName,
        this
      );
    }
  }
}


export { SPEFileDrop__Incoming };
