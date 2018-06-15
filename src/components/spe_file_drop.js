require('./spe_file_drop/__incoming');
const { EVENTS } = require('../constants');
const { AsperaDragDropService } = require('../services/aspera_drag_drop_service');
const { AsperaFileSerializer } = require('../services/aspera_file_serializer');
const { AsperaUploadService } = require('../services/aspera_upload_service');
const { FileUploadService } = require('../services/file_upload_service');
const template = require('./spe_file_drop/template');
const ELEMENT_NAME = 'spe-file-drop';

// ShadyCSS polyfills scoped styles in browsers that don't support this
// ShadowDOM feature.
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
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
    this.empty = true;
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Called every time the element is inserted into the DOM. Useful for running
   * setup code, such as fetching resources or rendering. Generally, you should
   * try to delay work until this time.
   */
  connectedCallback() {
    let uploadButton = this.shadowRoot.getElementById('upload-button');
    if (uploadButton) {
      uploadButton.addEventListener('click', this.initiateUpload.bind(this));
    } else { console.log('no upload button'); }
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
          ).finally(this._updateChildren);
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
    return ['empty', 'incoming', 'uploading'];
  }

  get empty() {
    return this.hasAttribute('empty');
  }

  set empty(val) {
    if (val) {
      this.setAttribute('empty', '');
    } else {
      this.removeAttribute('empty');
    }
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

  get uploading() {
    return this.hasAttribute('uploading');
  }

  set uploading(val) {
    if (val) {
      this.setAttribute('uploading', '');
    } else {
      this.removeAttribute('uploading');
    }
  }

  get files() {
    if (!this._files) {
      this._files = new Proxy([], this._fileChangeHandler);
    }
    return this._files;
  }

  initiateUpload() {
    this.uploading = true;
    AsperaUploadService.upload(this.files, { folderIds: [21] }).then(
      (success) => { console.log(success); },
      (err) => { console.warn(err); }
    );
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
    let filesList = this.shadowRoot.getElementById('files-list');
    return {
      set(files, prop, value) {
        if (prop.match(/^\d+$/)) {
          if (!filesList.children.map(li => li.dataset.uuid).includes(value.uuid)) {
            let file = document.createElement('li');
            file.innerText = value.fileName;
            file.dataset.uuid = value.uuid;
            file.dataset.fullFilePath = value.fullFilePath;
            filesList.prepend(file);
          }
        }
        let result = Reflect.set(...arguments);
        _this.empty = !files.length;
        return result;
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
