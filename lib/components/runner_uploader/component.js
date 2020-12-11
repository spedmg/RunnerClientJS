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
require('./__file'); // <runner-uploader--file> sub-component

var _require = require('../../constants'),
    EVENTS = _require.EVENTS;

var _require2 = require('../../services/aspera_connect_service'),
    AsperaConnectService = _require2.AsperaConnectService;

var _require3 = require('../../services/aspera_drag_drop_service'),
    AsperaDragDropService = _require3.AsperaDragDropService;

var _require4 = require('../../services/aspera_file_serializer'),
    AsperaFileSerializer = _require4.AsperaFileSerializer;

var _require5 = require('../../services/aspera_upload_service'),
    AsperaUploadService = _require5.AsperaUploadService;

var _require6 = require('../../services/file_upload_service'),
    FileUploadService = _require6.FileUploadService;

var template = require('./template');
var ELEMENT_NAME = 'runner-uploader';

// ShadyCSS polyfills scoped styles in browsers that don't support this
// ShadowDOM feature.
if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
}

var RunnerUploader = function (_CustomElement2) {
  _inherits(RunnerUploader, _CustomElement2);

  _createClass(RunnerUploader, null, [{
    key: 'elName',

    /**
     * Name of the HTML element
     */
    get: function get() {
      return ELEMENT_NAME;
    }

    /**
     * An instance of the element is created or upgraded. Useful for initializing
     * state, settings up event listeners, or creating shadow dom. See the spec
     * for restrictions on what you can do in the constructor.
     */

  }]);

  function RunnerUploader() {
    _classCallCheck(this, RunnerUploader);

    var _this = _possibleConstructorReturn(this, (RunnerUploader.__proto__ || Object.getPrototypeOf(RunnerUploader)).call(this));

    _this.empty = true;
    var shadowRoot = _this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    return _this;
  }

  /**
   * Called every time the element is inserted into the DOM. Useful for running
   * setup code, such as fetching resources or rendering. Generally, you should
   * try to delay work until this time.
   */


  _createClass(RunnerUploader, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      var _this2 = this;

      this._connectDragDrop();

      var uploadButton = this.shadowRoot.getElementById('upload-button');
      uploadButton.addEventListener('click', this.initiateUpload.bind(this));

      var addFilesButton = this.shadowRoot.getElementById('add-files-button');
      addFilesButton.addEventListener('click', this.addFiles.bind(this));

      var addMoreButton = this.shadowRoot.getElementById('add-more-button');
      addMoreButton.addEventListener('click', this.reset.bind(this));

      this._filesList.addEventListener(EVENTS.REMOVE_FILE, function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (_this2.uploading) {
          return;
        }

        var target = evt.target;

        FileUploadService.removeFileByUUID(_this2.files, evt.detail.uuid).then(function () {
          target.remove();
          _this2._emitFilesRemovedEvent();
        });
      });
    }

    /**
     * Called every time the element is removed from the DOM. Useful for running
     * clean up code.
     */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      AsperaDragDropService.reset();
    }

    /**
     * Elements can react to attribute changes by defining a
     * attributeChangedCallback. The browser will call this method for every
     * change to attributes listed in the observedAttributes array.
     */

  }, {
    key: 'addFiles',
    value: function addFiles() {
      var _this3 = this;

      AsperaConnectService.showFileUploadDialog(function (result) {
        _this3._addFilesFromAspera(result);
      });
    }
  }, {
    key: 'initiateUpload',
    value: function initiateUpload() {
      if (this.uploading) {
        return;
      }
      if (this.error) {
        this.error = false;
      }

      this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_STARTED, {
        bubbles: true,
        detail: {
          files: this.files
        }
      }));
      this.uploading = true;
      Array.from(this._filesList.children).forEach(function (file) {
        return file.locked = true;
      });
      AsperaDragDropService.reset();

      AsperaUploadService.upload(this.files, { folderIds: this.folderIDs }).then(this._listenForTransferComplete.bind(this), this._handleUploadFailure.bind(this));
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._files = undefined;
      Array.from(this._filesList.children).forEach(function (file) {
        return file.remove();
      });
      this.uploadComplete = false;
      this.empty = true;
      this._connectDragDrop();
    }
  }, {
    key: '_addFilesFromAspera',
    value: function _addFilesFromAspera(data) {
      var _this4 = this;

      FileUploadService.addFiles(this.files, AsperaFileSerializer.serialize(data)).then(function (data) {
        _this4._emitFilesAddedEvent(true, data);
      }, function (error) {
        _this4._emitFilesAddedEvent(false, error);
      });
    }
  }, {
    key: '_connectDragDrop',
    value: function _connectDragDrop() {
      var _this5 = this;

      AsperaDragDropService.addTarget(this, {
        dragenter: [function () {
          _this5.incoming = true;
        }],
        dragleave: [function () {
          _this5.incoming = false;
        }],
        drop: [function (dragObject) {
          _this5.incoming = false;
          _this5._addFilesFromAspera(dragObject);
        }]
      });
    }
  }, {
    key: '_handleUploadFailure',
    value: function _handleUploadFailure() {
      this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_FAILED, {
        bubbles: true,
        detail: {
          currentFiles: this.files
        }
      }));
      this.uploading = false;
      Array.from(this._filesList.children).forEach(function (file) {
        return file.locked = false;
      });
      this._connectDragDrop();
      this.error = true;
    }
  }, {
    key: '_emitFilesAddedEvent',
    value: function _emitFilesAddedEvent(success, data) {
      this._fileChangeHandler();
      this.dispatchEvent(new CustomEvent(EVENTS.FILES_ADDED, {
        detail: Object.assign({ success: success }, data),
        bubbles: true
      }));
    }
  }, {
    key: '_emitFilesRemovedEvent',
    value: function _emitFilesRemovedEvent() {
      this.dispatchEvent(new CustomEvent(EVENTS.FILES_REMOVED, {
        detail: { currentFiles: this.files },
        bubbles: true
      }));
    }
  }, {
    key: '_listenForTransferComplete',
    value: function _listenForTransferComplete(transferInfo) {
      var _this6 = this;

      var requestID = transferInfo.data.connection_settings.request_id;
      var listener = function listener(transferCompleteInfo) {
        if (transferCompleteInfo.token === requestID && transferCompleteInfo.isBatchComplete) {
          _this6._uploadComplete();

          var listenerIdx = AsperaConnectService.eventCallbacks.transferComplete.indexOf(listener);
          AsperaConnectService.eventCallbacks.transferComplete.splice(listenerIdx, 1);
        }
      };
      AsperaConnectService.eventCallbacks.transferComplete.push(listener);
    }
  }, {
    key: '_uploadComplete',
    value: function _uploadComplete() {
      this.dispatchEvent(new CustomEvent(EVENTS.UPLOAD_COMPLETE, {
        bubbles: true,
        detail: {
          currentFiles: this.files
        }
      }));

      this.uploading = false;
      this.uploadComplete = true;
    }
  }, {
    key: '_fileChangeHandler',
    value: function _fileChangeHandler() {
      var _this7 = this;

      var renderedUUIDs = Array.from(this._filesList.children).map(function (li) {
        return li.dataset.uuid;
      });
      this.files.forEach(function (file) {
        if (!renderedUUIDs.includes(file.uuid)) {
          var fileEl = document.createElement('runner-uploader--file');
          fileEl.innerHTML = '<span slot="fileName">' + file.fileName + '</span>';
          fileEl.dataset.uuid = file.uuid;
          fileEl.dataset.tooltip = file.fullFilePath;
          _this7._filesList.prepend(fileEl);
        }
      });
      this.empty = !this.files.length;
    }
  }, {
    key: 'destinationFolder',
    get: function get() {
      return this.getAttribute('destination-folder');
    },
    set: function set(val) {
      if (!val) {
        this.removeAttribute('destination-folder');
      } else {
        if (!/\d+/.test(val)) {
          throw new Error('[<' + this.elName + '>] destination-folder must be an integer');
        }
        this.setAttribute('destination-folder', val);
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
    key: 'folderIDs',
    get: function get() {
      if (!this._folderIDs) {
        if (this.destinationFolder) {
          this._folderIDs = [this.destinationFolder];
        } else {
          this._folderIDs = [];
        }
      }
      return this._folderIDs;
    },
    set: function set(val) {
      if (val.constructor.name !== 'Array' || !val.every(function (id) {
        return (/\d+/.test(id)
        );
      })) {
        throw new Error('[<' + this.elName + '>] folderIDs must be an Array of numbers');
      }
      this.destinationFolder = undefined;
      this._folderIDs = val;
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
  }, {
    key: 'files',
    get: function get() {
      if (!this._files) {
        this._files = [];
      }
      return this._files;
    }
  }, {
    key: '_filesList',
    get: function get() {
      if (!this._filesListEl) {
        this._filesListEl = this.shadowRoot.getElementById('files-list');
      }
      return this._filesListEl;
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
      return ['destinationFolder', 'empty', 'error', 'incoming', 'uploading', 'uploadComplete'];
    }
  }]);

  return RunnerUploader;
}(_CustomElement);

RunnerUploader.register();

module.exports = { RunnerUploader: RunnerUploader };