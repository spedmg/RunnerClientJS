'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./aspera_connect_service'),
    AsperaConnectService = _require.AsperaConnectService;

var _require2 = require('./log_service'),
    LogService = _require2.LogService;

var AW4 = window.AW4;

var DEFAULT_EVENT_CALLBACKS = {
  all: [],
  dragEnter: [],
  dragLeave: [],
  dragOver: [],
  drop: []
};

var AsperaDragDropService = function () {
  function AsperaDragDropService() {
    _classCallCheck(this, AsperaDragDropService);
  }

  _createClass(AsperaDragDropService, null, [{
    key: 'addTarget',
    value: function addTarget(target, eventCallbacks) {
      AsperaConnectService.connect.initSession();
      this.target = target;

      var callbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS, eventCallbacks);
      var registerAll = !!callbacks.all.length;
      if (!!callbacks.dragEnter.length || registerAll) {
        this._dragEnterCallback = this.dragEnterCallback.bind(this);
        target.addEventListener('dragenter', this._dragEnterCallback);
      }
      if (!!callbacks.dragLeave.length || registerAll) {
        this._dragLeaveCallback = this.dragLeaveCallback.bind(this);
        target.addEventListener('dragleave', this._dragLeaveCallback);
      }
      if (!!callbacks.dragOver.length || !!callbacks.drop.length || registerAll) {
        this._dragOverCallback = this.dragOverCallback.bind(this);
        target.addEventListener('dragover', this._dragOverCallback);
      }
      if (!!callbacks.drop.length || registerAll) {
        this._dropCallback = this.dropCallback.bind(this);
        target.addEventListener('drop', this._dropCallback);
      }

      this.eventCallbacks = callbacks;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.target.removeEventListener('dragenter', this._dragEnterCallback);
      this.target.removeEventListener('dragleave', this._dragLeaveCallback);
      this.target.removeEventListener('dragover', this._dragOverCallback);
      this.target.removeEventListener('drop', this._dropCallback);
      this.eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS);
      this._target = undefined;
    }
  }, {
    key: 'dragEnterCallback',
    value: function dragEnterCallback(event) {
      event.stopPropagation();
      event.preventDefault();
      this._executeEventCallbacksFor('dragEnter', { event: event });
    }
  }, {
    key: 'dragLeaveCallback',
    value: function dragLeaveCallback(event) {
      event.stopPropagation();
      event.preventDefault();
      this._executeEventCallbacksFor('dragLeave', { event: event });
    }
  }, {
    key: 'dragOverCallback',
    value: function dragOverCallback(event) {
      event.stopPropagation();
      event.preventDefault();
      this._executeEventCallbacksFor('dragOver', { event: event });
    }
  }, {
    key: 'dropCallback',
    value: function dropCallback(event) {
      var _this = this;

      event.stopPropagation();
      event.preventDefault();

      var filesDropped = event.dataTransfer.files;
      var data = {};
      data.dataTransfer = {};
      data.dataTransfer.files = [];
      for (var i = 0; i < filesDropped.length; i++) {
        var fileObject = {
          'lastModifiedDate': filesDropped[i].lastModifiedDate,
          'name': filesDropped[i].name,
          'size': filesDropped[i].size,
          'type': filesDropped[i].type
        };
        data.dataTransfer.files.push(fileObject);
      }

      this._groupedFolderContents(event).then(function (manifestGrouping) {
        var dropHelper = function dropHelper(response) {
          _this._executeEventCallbacksFor('drop', { event: event, files: response, dragDropManifestGrouping: manifestGrouping });
        };

        AsperaConnectService.connect.connectHttpRequest(AW4.Connect.HTTP_METHOD.POST, '/connect/file/dropped-files', data, AW4.Utils.SESSION_ID, { success: dropHelper });
      });
    }
  }, {
    key: '_executeEventCallbacksFor',
    value: function _executeEventCallbacksFor(eventName, data) {
      this.eventCallbacks[eventName].forEach(function (cb) {
        cb(data);
      });
      this.eventCallbacks.all.forEach(function (cb) {
        cb(data);
      });
    }
  }, {
    key: '_groupedFolderContents',
    value: function _groupedFolderContents(evt) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var grouping = {};

        if (!evt.dataTransfer.items) {
          resolve(grouping);
        }

        var length = evt.dataTransfer.items.length;
        var remaining = length;

        var _loop = function _loop(i) {
          var item = evt.dataTransfer.items[i];
          var entry = item.webkitGetAsEntry();
          _this2._processEntry(entry, grouping).then(function () {
            remaining--;
            if (!remaining) {
              LogService.debug('[RunnerClient.AsperaDragDropService] Parsed drag-drop contents:', grouping);
              resolve(grouping);
            }
          }, function (err) {
            LogService.warn('Failed to read directory contents for ' + entry.fullPath, err);
            reject(err);
          });
        };

        for (var i = 0; i < length; i++) {
          _loop(i);
        }
      });
    }
  }, {
    key: '_processEntry',
    value: function _processEntry(topLevelEntry, grouping) {
      return new Promise(function (resolve, reject) {
        var key = topLevelEntry.name;
        var directoryCount = 0;
        var processEntries = function processEntries(entries) {
          entries.forEach(function (entry) {
            if (entry.isDirectory) {
              directoryCount++;
              var read = function read(reader) {
                reader.readEntries(function (childEntries) {
                  if (childEntries.length) {
                    processEntries(childEntries);
                    read(reader);
                  } else {
                    directoryCount--;
                    if (!directoryCount) {
                      resolve();
                    }
                  }
                }, function (err) {
                  LogService.warn('Failed to read directory contents for ' + entry.fullPath, err);
                  reject(err);
                });
              };

              read(entry.createReader());
            } else {
              grouping[key] = grouping[key] || [];
              grouping[key].push(entry.fullPath);
              if (entry === topLevelEntry) {
                resolve();
              }
            }
          });
        };

        processEntries([topLevelEntry]);
      });
    }
  }, {
    key: 'target',
    get: function get() {
      return this._target;
    },
    set: function set(el) {
      if (this._target) {
        throw new Error('[RunnerClient.AsperaDragDropService] Cannot set more than one target!');
      }
      this._target = el;
    }
  }]);

  return AsperaDragDropService;
}();

module.exports = { AsperaDragDropService: AsperaDragDropService };