require('./__file');
const { EVENTS } = require('../../constants');
const { AsperaConnectService } = require('../../services/aspera_connect_service');
const { AsperaDragDropService } = require('../../services/aspera_drag_drop_service');
const { AsperaFileSerializer } = require('../../services/aspera_file_serializer');
const { AsperaUploadService } = require('../../services/aspera_upload_service');
const { FileUploadService } = require('../../services/file_upload_service');
const template = require('./template');
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
    this._connectDragDrop();

    const uploadButton = this.shadowRoot.getElementById('upload-button');
    uploadButton.addEventListener('click', this.initiateUpload.bind(this));

    const addFilesButton = this.shadowRoot.getElementById('add-files-button');
    addFilesButton.addEventListener('click', this.addFiles.bind(this));

    const addMoreButton = this.shadowRoot.getElementById('add-more-button');
    addMoreButton.addEventListener('click', this.reset.bind(this));

    this._filesList.addEventListener(EVENTS.REMOVE_FILE, (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (this.uploading) { return; }

      let target = evt.target;

      FileUploadService.removeFileByUUID(this.files, evt.detail.uuid).then(
        () => {
          target.remove();
          this._emitFilesRemovedEvent();
        }
      );
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
   * Elements can react to attribute changes by defining a
   * attributeChangedCallback. The browser will call this method for every
   * change to attributes listed in the observedAttributes array.
   */
  static get observedAttributes() {
    return ['empty', 'incoming', 'uploading', 'uploadComplete'];
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

  get uploadComplete() {
    return this.hasAttribute('upload-complete');
  }

  set uploadComplete(val) {
    if (val) {
      this.setAttribute('upload-complete', '');
    } else {
      this.removeAttribute('upload-complete');
    }
  }

  get files() {
    if (!this._files) {
      this._files = new Proxy([], this._fileChangeHandler);
    }
    return this._files;
  }


  addFiles() {
    AsperaConnectService.showFileUploadDialog((result) => {
      this._addFilesFromAspera(result);
    });
  }

  initiateUpload() {
    if (this.uploading) { return; }

    this.uploading = true;
    this._filesList.children.forEach(file => file.locked = true);
    AsperaDragDropService.reset();

    AsperaUploadService.upload(this.files, { folderIds: [21] }).then(
      this._listenForTransferComplete.bind(this),
      this._handleUploadFailure.bind(this)
    );
  }

  reset() {
    this._files = undefined;
    this._filesList.children.forEach(file => file.remove());
    this.uploadComplete = false;
    this.empty = true;
    this._connectDragDrop();
  }

  _addFilesFromAspera(data) {
    FileUploadService.addFiles(
      this.files,
      AsperaFileSerializer.serialize(data)
    ).then(
      (data) => { this._emitFilesAddedEvent(true, data); },
      (error) => { this._emitFilesAddedEvent(false, error); },
    );
  }

  _connectDragDrop() {
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
          this._addFilesFromAspera(dragObject);
        }
      ]
    });
  }

  _handleUploadFailure() {
    this.uploading = false;
    this._filesList.children.forEach(file => file.locked = false);
    this.error = true;
  }

  _emitFilesAddedEvent(success, data) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.FILES_ADDED, {
        detail: Object.assign({ success }, data),
        bubbles: true,
      })
    );
  }

  _emitFilesRemovedEvent() {
    this.dispatchEvent(
      new CustomEvent(EVENTS.FILES_REMOVED, {
        detail: { currentFiles: this.files },
        bubbles: true,
      })
    );
  }

  _listenForTransferComplete(transferInfo) {
    let requestID = transferInfo.data.connection_settings.request_id;
    let listener = (transferCompleteInfo) => {
      if (transferCompleteInfo.token === requestID && transferCompleteInfo.isBatchComplete) {
        this._uploadComplete();

        let listenerIdx = AsperaConnectService.eventCallbacks.transferComplete.indexOf(listener);
        AsperaConnectService.eventCallbacks.transferComplete.splice(listenerIdx, 1);
      }
    };
    AsperaConnectService.eventCallbacks.transferComplete.push(listener);
  }

  _uploadComplete() {
    this.uploading = false;
    this.uploadComplete = true;
  }

  get _fileChangeHandler() {
    let _this = this;
    return {
      set(files, prop, value) {
        if (prop.match(/^\d+$/)) {
          if (!_this._filesList.children.map(li => li.dataset.uuid).includes(value.uuid)) {
            let file = document.createElement('spe-file-drop--file');
            file.innerHTML = `<span slot="fileName">${value.fileName}</span>`;
            file.dataset.uuid = value.uuid;
            file.dataset.tooltip = value.fullFilePath;
            _this._filesList.prepend(file);
          }
        }
        let result = Reflect.set(...arguments);
        _this.empty = !files.length;
        return result;
      }
    };
  }

  get _filesList() {
    if (!this._filesListEl) {
      this._filesListEl = this.shadowRoot.getElementById('files-list');
    }
    return this._filesListEl;
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
