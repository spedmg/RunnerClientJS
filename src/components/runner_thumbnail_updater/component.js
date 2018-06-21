// Base element for <runner-uploader> and <runner-thumbnail-updater>
const { API } = require('../../api');
const { FileFactory } = require('../../services/file_factory');
const { LogService } = require('../../services/log_service');
const { ThumbnailReplacementService } = require('../../services/thumbnail_replacement_service');
const { TranslationService } = require('../../services/translation_service');
const TRANSLATION_SCOPE = { scope: 'RunnerThumbnailUpdater' };
const { EVENTS } = require('../../constants');
const ELEMENT_NAME = 'runner-thumbnail-updater';
const template = require('./template');
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

class RunnerThumbnailUpdater extends HTMLElement {
  static get elName() { return ELEMENT_NAME; }

  constructor() {
    super();
    this.empty = true;
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this._addEventListeners();
  }

  static get observedAttributes() {
    return [
      'assetItemID',
      'empty',
      'error',
      'incoming',
      'uploading',
      'uploadComplete'
    ];
  }

  get assetItemID() {
    return this.getAttribute('asset-item-id');
  }

  set assetItemID(val) {
    if (!val) {
      this.removeAttribute('asset-item-id');
    } else {
      if (!/\d+/.test(val)) {
        throw new Error(`[<${this.elName}>] asset-item-id must be an integer`);
      }
      this.setAttribute('asset-item-id', val);
    }
  }

  get assetItemIDs() {
    if (!this._assetItemIDs) {
      if (this.assetItemID) {
        this._assetItemIDs = [this.assetItemID];
      } else {
        this._assetItemIDs = [];
      }
    }
    return this._assetItemIDs;
  }

  set assetItemIDs(val) {
    if (val.constructor.name !== 'Array' || !val.every(id => /\d+/.test(id))) {
      throw new Error(`[<${this.elName}>] assetItemIDs must be an Array of numbers`);
    }
    this.assetItemID = undefined;
    this._assetItemIDs = val;
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

  _addEventListeners() {
    // Drag-drop setup
    this._dragEnterListener = ((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.incoming = true;
    }).bind(this);
    this._dragLeaveListener = ((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.incoming = false;
    }).bind(this);
    this._dragOverListener = ((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    }).bind(this);
    this._dropListener = ((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.incoming = false;
      this._handleDrop(evt);
    }).bind(this);

    this.addEventListener('dragenter', this._dragEnterListener);
    this.addEventListener('dragleave', this._dragLeaveListener);
    this.addEventListener('dragover', this._dragOverListener);
    this.addEventListener('drop', this._dropListener);

    // "Upload" button setup
    const uploadBtn = this.shadowRoot.getElementById('upload-button');
    this._uploadClickListener = ((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this._beginUpload();
    }).bind(this);
    uploadBtn.addEventListener('click', this._uploadClickListener);

    // "Add File" button
    const addFileBtn = this.shadowRoot.getElementById('add-file-button');
    this._addFilesClickListener = ((evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.shadowRoot.getElementById('add-file-input').click();
    }).bind(this);
    addFileBtn.addEventListener('click', this._addFilesClickListener);

    // File added via input
    const fileInput = this.shadowRoot.getElementById('add-file-input');
    this._fileAddedListener = ((evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this._handleFileAdded(evt);
    }).bind(this);
    fileInput.addEventListener('change', this._fileAddedListener);
  }

  _beginUpload() {
    this.errors = false;
    this.uploading = true;
    let promises = this.assetItemIDs.map(assetItemID => {
      return ThumbnailReplacementService.replaceThumbnailFor(assetItemID, this.file);
    });
    Promise.all(promises).then(
      (results) => {
        return API.bulkUpdateAssetItems(results);
      }
    ).then(
      () => {
        this.uploading = false;
        this.uploadComplete = true;
        this._emitUploadCompleteEvent();
      }
    ).catch(
      (err) => {
        this.uploading = false;
        LogService.warn(`[${ELEMENT_NAME}] Failed to update thumbnail!`, err);
        this._setErrorMessage('error');
        this._emitUploadFailedEvent(err);
      }
    );
  }

  _emitUploadCompleteEvent() {
    this.dispatchEvent(
      new CustomEvent(EVENTS.UPLOAD_COMPLETE, {
        bubbles: true,
        detail: {
          assetItemIDs: this.assetItemIDs,
          filename: this.file.fileName
        }
      })
    );
  }

  _emitUploadFailedEvent(error) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.UPLOAD_FAILED, {
        bubbles: true,
        detail: {
          assetItemIDs: this.assetItemIDs,
          filename: this.file.fileName,
          error: error
        }
      })
    );
  }

  _handleDrop(event) {
    LogService.debug(`[${ELEMENT_NAME}] Drop event recieved`, event);
    this.error = false;
    let files = event.dataTransfer.files;
    if (files.length > 1) {
      this._setErrorMessage('tooMany');
      return;
    }

    let file = new FileFactory(files[0]);
    if (!file.validThumbnail()) {
      this._setErrorMessage('invalidFile');
      return;
    }

    this.file = file;
    this._setPreview(file);
  }

  _handleFileAdded(event) {
    LogService.debug(`[${ELEMENT_NAME}] File added via input`, event);
    this.error = false;

    let file = new FileFactory(event.target.files[0]);
    if (!file.validThumbnail()) {
      this._setErrorMessage('invalidFile');
      return;
    }

    this.file = file;
    this._setPreview(file);
  }

  _setErrorMessage(key) {
    let errMsg = this.shadowRoot.getElementById('error-message');
    let errText = TranslationService.translate(key, TRANSLATION_SCOPE);
    errMsg.innerText = errText;
    this.error = true;
  }

  _setPreview(file) {
    this.empty = false;

    let previewContainer = this.shadowRoot.getElementById('preview');
    if (previewContainer.children.length) {
      Array.from(previewContainer.children).forEach(el => el.remove());
    }
    let progressEl = document.createElement('progress');
    previewContainer.appendChild(progressEl);

    let reader = new FileReader();
    reader.onprogress = (evt) => {
      LogService.debug(`[${ELEMENT_NAME}] FileReader progress`, evt);
      progressEl.max = evt.total;
      progressEl.value = evt.loaded;
    };

    reader.onload = (evt) => {
      LogService.debug(`[${ELEMENT_NAME}] FileReader loaded`, evt);
      progressEl.remove();
      let img = document.createElement('img');
      img.src = reader.result;
      previewContainer.appendChild(img);
    };

    reader.onerror = (evt) => {
      LogService.warn(`[${ELEMENT_NAME}] FileReader load error`, evt);
      this.empty = true;
      this._setErrorMessage('fileReadFailed');
    };

    reader.readAsDataURL(file.fileObj);
  }

  static register() {
    // Register the custom element to the DOM
    window.customElements.define(
      this.elName,
      this
    );
  }
}

RunnerThumbnailUpdater.register();

module.exports = { RunnerThumbnailUpdater };
