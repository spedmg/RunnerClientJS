require('./__file'); // <runner-uploader--file> sub-component
const { EVENTS } = require('../../constants');
const { AsperaConnectService } = require('../../services/aspera_connect_service');
const { AsperaDragDropService } = require('../../services/aspera_drag_drop_service');
const { AsperaFileSerializer } = require('../../services/aspera_file_serializer');
const { AsperaUploadService } = require('../../services/aspera_upload_service');
const { FileUploadService } = require('../../services/file_upload_service');
const template = require('./template');
const ELEMENT_NAME = 'runner-uploader';

// ShadyCSS polyfills scoped styles in browsers that don't support this
// ShadowDOM feature.
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

class RunnerUploader extends HTMLElement {
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
    return [
      'destinationFolder',
      'empty',
      'error',
      'incoming',
      'uploading',
      'uploadComplete'
    ];
  }

  get destinationFolder() {
    return this.getAttribute('destination-folder');
  }

  set destinationFolder(val) {
    if (!val) {
      this.removeAttribute('destination-folder');
    } else {
      if (!/\d+/.test(val)) {
        throw new Error(`[<${this.elName}>] destination-folder must be an integer`);
      }
      this.setAttribute('destination-folder', val);
    }
  }

  get error() {
    return this.hasAttribute('error');
  }

  set error(val) {
    if (val) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
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

  get folderIDs() {
    if (!this._folderIDs) {
      if (this.destinationFolder) {
        this._folderIDs = [this.destinationFolder];
      } else {
        this._folderIDs = [];
      }
    }
    return this._folderIDs;
  }

  set folderIDs(val) {
    if (val.constructor.name !== 'Array' || !val.every(id => /\d+/.test(id))) {
      throw new Error(`[<${this.elName}>] folderIDs must be an Array of numbers`);
    }
    this.destinationFolder = undefined;
    this._folderIDs = val;
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
      this._files = [];
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
    if (this.error) { this.error = false; }

    this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_STARTED, {
      bubbles: true,
      detail: {
        files: this.files,
      }
    }));
    this.uploading = true;
    Array.from(this._filesList.children).forEach(file => file.locked = true);
    AsperaDragDropService.reset();

    AsperaUploadService.upload(this.files, { folderIds: this.folderIDs }).then(
      this._listenForTransferComplete.bind(this),
      this._handleUploadFailure.bind(this)
    );
  }

  reset() {
    this._files = undefined;
    Array.from(this._filesList.children).forEach(file => file.remove());
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
      dragenter: [
        () => { this.incoming = true; }
      ],
      dragleave: [
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
    this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_FAILED, {
      bubbles: true,
      detail: {
        currentFiles: this.files,
      }
    }));
    this.uploading = false;
    Array.from(this._filesList.children).forEach(file => file.locked = false);
    this._connectDragDrop();
    this.error = true;
  }

  _emitFilesAddedEvent(success, data) {
    this._fileChangeHandler();
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
    this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_COMPLETE, {
      bubbles: true,
      detail: {
        currentFiles: this.files,
      }
    }));

    this.uploading = false;
    this.uploadComplete = true;
  }

  _fileChangeHandler() {
    let renderedUUIDs = Array.from(this._filesList.children).map(li => li.dataset.uuid);
    this.files.forEach(file => {
      if (!renderedUUIDs.includes(file.uuid)) {
        let fileEl = document.createElement('runner-uploader--file');
        fileEl.innerHTML = `<span slot="fileName">${file.fileName}</span>`;
        fileEl.dataset.uuid = file.uuid;
        fileEl.dataset.tooltip = file.fullFilePath;
        this._filesList.prepend(fileEl);
      }
    });
    this.empty = !this.files.length;
  }

  get _filesList() {
    if (!this._filesListEl) {
      this._filesListEl = this.shadowRoot.getElementById('files-list');
    }
    return this._filesListEl;
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

RunnerUploader.register();

module.exports = { RunnerUploader };
