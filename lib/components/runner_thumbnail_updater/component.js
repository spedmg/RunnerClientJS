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

// Base element for <runner-uploader> and <runner-thumbnail-updater>
var _require = require('../../api'),
    API = _require.API;

var _require2 = require('../../services/file_factory'),
    FileFactory = _require2.FileFactory;

var _require3 = require('../../services/log_service'),
    LogService = _require3.LogService;

var _require4 = require('../../services/thumbnail_replacement_service'),
    ThumbnailReplacementService = _require4.ThumbnailReplacementService;

var _require5 = require('../../services/translation_service'),
    TranslationService = _require5.TranslationService;

var TRANSLATION_SCOPE = { scope: 'RunnerThumbnailUpdater' };

var _require6 = require('../../constants'),
    EVENTS = _require6.EVENTS;

var ELEMENT_NAME = 'runner-thumbnail-updater';
var template = require('./template');
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

var RunnerThumbnailUpdater = function (_CustomElement2) {
  _inherits(RunnerThumbnailUpdater, _CustomElement2);

  _createClass(RunnerThumbnailUpdater, null, [{
    key: 'elName',
    get: function get() {
      return ELEMENT_NAME;
    }
  }]);

  function RunnerThumbnailUpdater() {
    _classCallCheck(this, RunnerThumbnailUpdater);

    var _this = _possibleConstructorReturn(this, (RunnerThumbnailUpdater.__proto__ || Object.getPrototypeOf(RunnerThumbnailUpdater)).call(this));

    _this.empty = true;
    var shadowRoot = _this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    return _this;
  }

  _createClass(RunnerThumbnailUpdater, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this._addEventListeners();
    }
  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      var _this2 = this;

      // Drag-drop setup
      this._dragEnterListener = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        _this2.incoming = true;
      }.bind(this);
      this._dragLeaveListener = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        _this2.incoming = false;
      }.bind(this);
      this._dragOverListener = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }.bind(this);
      this._dropListener = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        _this2.incoming = false;
        _this2._handleDrop(evt);
      }.bind(this);

      this.addEventListener('dragenter', this._dragEnterListener);
      this.addEventListener('dragleave', this._dragLeaveListener);
      this.addEventListener('dragover', this._dragOverListener);
      this.addEventListener('drop', this._dropListener);

      // "Upload" button setup
      var uploadBtn = this.shadowRoot.getElementById('upload-button');
      this._uploadClickListener = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        _this2._beginUpload();
      }.bind(this);
      uploadBtn.addEventListener('click', this._uploadClickListener);

      // "Add File" button
      var addFileBtn = this.shadowRoot.getElementById('add-file-button');
      this._addFilesClickListener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        _this2.shadowRoot.getElementById('add-file-input').click();
      }.bind(this);
      addFileBtn.addEventListener('click', this._addFilesClickListener);

      // File added via input
      var fileInput = this.shadowRoot.getElementById('add-file-input');
      this._fileAddedListener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        _this2._handleFileAdded(evt);
      }.bind(this);
      fileInput.addEventListener('change', this._fileAddedListener);
    }
  }, {
    key: '_beginUpload',
    value: function _beginUpload() {
      var _this3 = this;

      this.errors = false;
      this.uploading = true;
      var promises = this.assetItemIDs.map(function (assetItemID) {
        return ThumbnailReplacementService.replaceThumbnailFor(assetItemID, _this3.file);
      });
      Promise.all(promises).then(function (results) {
        return API.bulkUpdateAssetItems(results);
      }).then(function () {
        _this3.uploading = false;
        _this3.uploadComplete = true;
        _this3._emitUploadCompleteEvent();
      }).catch(function (err) {
        _this3.uploading = false;
        LogService.warn('[' + ELEMENT_NAME + '] Failed to update thumbnail!', err);
        _this3._setErrorMessage('error');
        _this3._emitUploadFailedEvent(err);
      });
    }
  }, {
    key: '_emitUploadCompleteEvent',
    value: function _emitUploadCompleteEvent() {
      this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_COMPLETE, {
        bubbles: true,
        detail: {
          assetItemIDs: this.assetItemIDs,
          filename: this.file.fileName
        }
      }));
    }
  }, {
    key: '_emitUploadFailedEvent',
    value: function _emitUploadFailedEvent(error) {
      this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_FAILED, {
        bubbles: true,
        detail: {
          assetItemIDs: this.assetItemIDs,
          filename: this.file.fileName,
          error: error
        }
      }));
    }
  }, {
    key: '_handleDrop',
    value: function _handleDrop(event) {
      LogService.debug('[' + ELEMENT_NAME + '] Drop event recieved', event);
      this.error = false;
      var files = event.dataTransfer.files;
      if (files.length > 1) {
        this._setErrorMessage('tooMany');
        return;
      }

      var file = new FileFactory(files[0]);
      if (!file.validThumbnail()) {
        this._setErrorMessage('invalidFile');
        return;
      }

      this.file = file;
      this._setPreview(file);
    }
  }, {
    key: '_handleFileAdded',
    value: function _handleFileAdded(event) {
      LogService.debug('[' + ELEMENT_NAME + '] File added via input', event);
      this.error = false;

      var file = new FileFactory(event.target.files[0]);
      if (!file.validThumbnail()) {
        this._setErrorMessage('invalidFile');
        return;
      }

      this.file = file;
      this._setPreview(file);
    }
  }, {
    key: '_setErrorMessage',
    value: function _setErrorMessage(key) {
      var errMsg = this.shadowRoot.getElementById('error-message');
      var errText = TranslationService.translate(key, TRANSLATION_SCOPE);
      errMsg.innerText = errText;
      this.error = true;
    }
  }, {
    key: '_setPreview',
    value: function _setPreview(file) {
      var _this4 = this;

      this.empty = false;

      var previewContainer = this.shadowRoot.getElementById('preview');
      if (previewContainer.children.length) {
        Array.from(previewContainer.children).forEach(function (el) {
          return el.remove();
        });
      }
      var progressEl = document.createElement('progress');
      previewContainer.appendChild(progressEl);

      var reader = new FileReader();
      reader.onprogress = function (evt) {
        LogService.debug('[' + ELEMENT_NAME + '] FileReader progress', evt);
        progressEl.max = evt.total;
        progressEl.value = evt.loaded;
      };

      reader.onload = function (evt) {
        LogService.debug('[' + ELEMENT_NAME + '] FileReader loaded', evt);
        progressEl.remove();
        var img = document.createElement('img');
        img.src = reader.result;
        previewContainer.appendChild(img);
      };

      reader.onerror = function (evt) {
        LogService.warn('[' + ELEMENT_NAME + '] FileReader load error', evt);
        _this4.empty = true;
        _this4._setErrorMessage('fileReadFailed');
      };

      reader.readAsDataURL(file.fileObj);
    }
  }, {
    key: 'assetItemID',
    get: function get() {
      return this.getAttribute('asset-item-id');
    },
    set: function set(val) {
      if (!val) {
        this.removeAttribute('asset-item-id');
      } else {
        if (!/\d+/.test(val)) {
          throw new Error('[<' + this.elName + '>] asset-item-id must be an integer');
        }
        this.setAttribute('asset-item-id', val);
      }
    }
  }, {
    key: 'assetItemIDs',
    get: function get() {
      if (!this._assetItemIDs) {
        if (this.assetItemID) {
          this._assetItemIDs = [this.assetItemID];
        } else {
          this._assetItemIDs = [];
        }
      }
      return this._assetItemIDs;
    },
    set: function set(val) {
      if (val.constructor.name !== 'Array' || !val.every(function (id) {
        return (/\d+/.test(id)
        );
      })) {
        throw new Error('[<' + this.elName + '>] assetItemIDs must be an Array of numbers');
      }
      this.assetItemID = undefined;
      this._assetItemIDs = val;
    }
  }, {
    key: 'empty',
    get: function get() {
      return this.hasAttribute('empty');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('empty', '');
      } else {
        this.removeAttribute('empty');
      }
    }
  }, {
    key: 'error',
    get: function get() {
      return this.hasAttribute('error');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('error', '');
      } else {
        this.removeAttribute('error');
      }
    }
  }, {
    key: 'incoming',
    get: function get() {
      return this.hasAttribute('incoming');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('incoming', '');
      } else {
        this.removeAttribute('incoming');
      }
    }
  }, {
    key: 'uploading',
    get: function get() {
      return this.hasAttribute('uploading');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('uploading', '');
      } else {
        this.removeAttribute('uploading');
      }
    }
  }, {
    key: 'uploadComplete',
    get: function get() {
      return this.hasAttribute('upload-complete');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('upload-complete', '');
      } else {
        this.removeAttribute('upload-complete');
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
      return ['assetItemID', 'empty', 'error', 'incoming', 'uploading', 'uploadComplete'];
    }
  }]);

  return RunnerThumbnailUpdater;
}(_CustomElement);

RunnerThumbnailUpdater.register();

module.exports = { RunnerThumbnailUpdater: RunnerThumbnailUpdater };