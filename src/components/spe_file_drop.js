import ShadyCSS from 'shadycss';
import { SPEFileDrop__Incoming } from './spe_file_drop/__incoming';

const ELEMENT_NAME = 'spe-file-drop';
const tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      color: green;
    }
  </style>
  Hello from spe-file-drop!
  <spe-file-drop--incoming incoming></spe-file-drop--incoming>
`;

ShadyCSS.prepareTemplate(tmpl, ELEMENT_NAME);

class SPEFileDrop extends HTMLElement {
  /**
   * Name of the HTML element
   */
  static get elName() { return ELEMENT_NAME; }

  /**
   * An instance of the element is created or upgraded. Useful for initializing
   * state, settings up event listeners, or creating shadow dom. See the spec
   * for restrictions on what you can do in the constructor.
   */
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  /**
   * Called every time the element is inserted into the DOM. Useful for running
   * setup code, such as fetching resources or rendering. Generally, you should
   * try to delay work until this time.
   */
  connectedCallback() {
  }

  /**
   * Called every time the element is removed from the DOM. Useful for running
   * clean up code.
   */
  disconnectedCallback() {

  }

  /**
   * Called when an observed attribute has been added, removed, updated, or
   * replaced. Also called for initial values when an element is created by the
   * parser, or upgraded. Note: only attributes listed in the observedAttributes
   * property will receive this callback.
   */
  attributeChangedCallback(attrName, oldVal, newVal) {

  }

  /**
   * Elements can react to attribute changes by defining a
   * attributeChangedCallback. The browser will call this method for every
   * change to attributes listed in the observedAttributes array.
   */
  static get observedAttributes() {

  }

  static register(window) {
    // Register the custom element to the DOM
    if (window && window.customElements) {
      window.customElements.define(
        this.elName,
        this
      );
    }

    // Register the child elements
    [SPEFileDrop__Incoming].forEach(el => el.register(window));
  }
}

export { SPEFileDrop };
