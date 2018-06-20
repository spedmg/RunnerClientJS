// Base element for <runner-uploader> and <runner-thumbnail-updater>
const { FileFactory } = require('../../services/file_factory');
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
  }

  _handleDrop(event) {
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

    this._file = file;
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
      previewContainer.children.forEach(el => el.reomve());
    }
    let progressEl = document.createElement('progress');
    previewContainer.appendChild(progressEl);

    let reader = new FileReader();
    reader.onprogress = (evt) => {
      progressEl.max = evt.total;
      progressEl.value = evt.loaded;
    };

    reader.onload = () => {
      progressEl.remove();
      let img = document.createElement('img');
      img.src = reader.result;
      previewContainer.appendChild(img);
    };

    reader.onerror = () => {
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
