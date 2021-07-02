'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./aspera_connect_service'),
    AsperaConnectService = _require.AsperaConnectService;

var _require2 = require('./log_service'),
    LogService = _require2.LogService;

var AsperaDragDropService = function () {
  function AsperaDragDropService() {
    _classCallCheck(this, AsperaDragDropService);
  }

  _createClass(AsperaDragDropService, null, [{
    key: 'addTarget',
    value: function addTarget(element, eventCallbacks) {
      var _this = this;

      this.element = element;
      var key = 'drag-drop-element';
      var value = Number(new Date());
      element.setAttribute(key, value);
      var selector = '[' + key + '="' + value + '"]';

      this.dropListener = this._dropListener.bind(this);
      element.addEventListener('drop', this.dropListener);

      AsperaConnectService.connect.setDragDropTargets(selector, { dragEnter: true, dragLeave: true, drop: true }, function (result) {
        var eventType = result.event.type;
        var listeners = eventCallbacks[eventType];
        (listeners || []).forEach(function (listener) {
          if (eventType === 'drop') {
            var promiseKey = _this._promiseKeyFor(result.event);
            _this.promises[promiseKey].then(function (manifestGrouping) {
              result.dragDropManifestGrouping = manifestGrouping;
              listener(result);
              delete _this.promises[promiseKey];
            });
          } else {
            listener(result);
          }
        });
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.element.removeEventListener('drop', this.dropListener);
      this._promises = {};
    }
  }, {
    key: '_promiseKeyFor',
    value: function _promiseKeyFor(event) {
      return event.type + event.timeStamp;
    }
  }, {
    key: '_dropListener',
    value: function _dropListener() {
      this.promises[this._promiseKeyFor(event)] = this._groupedFolderContents(event);
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
    key: 'promises',
    get: function get() {
      if (!this._promises) {
        this._promises = {};
      }
      return this._promises;
    }
  }]);

  return AsperaDragDropService;
}();

module.exports = { AsperaDragDropService: AsperaDragDropService };