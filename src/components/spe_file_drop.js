require('./spe_file_drop/__incoming');
const { EVENTS } = require('../constants');
const { AsperaDragDropService } = require('../services/aspera_drag_drop_service');
const { AsperaFileSerializer } = require('../services/aspera_file_serializer');
const { FileUploadService } = require('../services/file_upload_service');

const ELEMENT_NAME = 'spe-file-drop';
const tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      border: 1px solid #999;
      height: 500px;
      width: 500px;
      background: #ccc;
    }

    :host[incoming] spe-file-drop--incoming {
      display: flex;
      z-index: 10;
    }
  </style>
  Hello from spe-file-drop!
  <spe-file-drop--incoming></spe-file-drop--incoming>
`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(tmpl, ELEMENT_NAME);
}

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
    AsperaDragDropService.addTarget(this, {
      dragEnter: [
        () => { this.incoming = true; }
      ],
      dragLeave: [
        () => { this.incoming = false; }
      ],
      drop: [
        (dragObject) => {
          this.incoming = false;
          FileUploadService.addFiles(
            this.files,
            AsperaFileSerializer.serialize(dragObject)
          ).then(
            (data) => { this._emitAddedFilesEvent(true, data); },
            (error) => { this._emitAddedFilesEvent(false, error); },
          );
        }
      ]
    });
  }

  /**
   * Called every time the element is removed from the DOM. Useful for running
   * clean up code.
   */
  disconnectedCallback() {
    AsperaDragDropService.reset();
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
    return ['incoming'];
  }

  get incoming() {
    return this.hasAttribute('incoming');
  }

  set incoming(val) {
    if (val) {
      this.setAttribute('incoming', '');
    } else {
      this.removeAttribute('incoming');
    }
  }

  get files() {
    if (!this._files) {
      this.__files = [];
      this._files = new Proxy(this.__files, this._fileChangeHandler);
    }
    return this._files;
  }

  _emitAddedFilesEvent(success, data) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.FILES_ADDED, {
        detail: Object.assign({ success }, data),
        bubbles: true,
      })
    );
  }

  get _fileChangeHandler() {
    let _this = this;
    return {
      set(files, prop, value) {
        console.log('prop', prop);
        console.log('value', value);
        console.log(_this);
        if (prop.match(/^\d+$/)) {
          let file = document.createElement('p');
          file.innerText = JSON.stringify(value.fileName);
          console.log(file);
          _this.shadowRoot.appendChild(file);
        }
        return Reflect.set(...arguments);
      }
    };
  }

  static register() {
    // Register the custom element to the DOM
    window.customElements.define(
      this.elName,
      this
    );
  }
}

SPEFileDrop.register();

module.exports = { SPEFileDrop };
