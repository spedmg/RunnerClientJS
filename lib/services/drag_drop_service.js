'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./log_service'),
    LogService = _require.LogService;

var DEFAULT_EVENT_CALLBACKS = {
  all: [],
  dragEnter: [],
  dragLeave: [],
  dragOver: [],
  drop: []
};

var DragDropService = function () {
  function DragDropService() {
    _classCallCheck(this, DragDropService);
  }

  _createClass(DragDropService, null, [{
    key: 'addTarget',
    value: function addTarget(target, eventCallbacks) {
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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
        var dragDropManifestGrouping;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.stopPropagation();
                event.preventDefault();

                _context.next = 4;
                return this._groupedFolderContents(event);

              case 4:
                dragDropManifestGrouping = _context.sent;

                this._executeEventCallbacksFor('drop', { event: event, dragDropManifestGrouping: dragDropManifestGrouping });

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function dropCallback(_x) {
        return _ref.apply(this, arguments);
      }

      return dropCallback;
    }()
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
    key: '_collectFiles',
    value: function _collectFiles(entries, path, collection) {
      var _this = this;

      var promises = [];
      return new Promise(function (resolve) {
        entries.forEach(function (entry) {
          if (entry.isDirectory) {
            var promise = new Promise(function (readResolve, readReject) {
              var reader = entry.createReader();
              var readEntries = function readEntries() {
                reader.readEntries(function (childEntries) {
                  if (childEntries.length) {
                    var childReadPromise = _this._collectFiles(childEntries, entry.fullPath, collection);
                    promises.push(childReadPromise);
                    readEntries();
                  } else {
                    readResolve();
                  }
                }, function (err) {
                  LogService.warn('Failed to read directory contents for ' + entry.fullPath, err);
                  readReject();
                });
              };

              readEntries();
            });
            promises.push(promise);
          } else {
            collection.push(path + '/' + entry.name);
          }
        });

        Promise.all(promises).then(function () {
          resolve(collection);
        });
      });
    }
  }, {
    key: '_groupedFolderContents',
    value: function _groupedFolderContents(evt) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var grouping = {};
        var promises = [];

        // IE & Safari don't support the `items` property
        if (!evt.dataTransfer.items) {
          resolve(grouping);
        }

        var _loop = function _loop(i) {
          var item = evt.dataTransfer.items[i];
          var fsEntry = item.webkitGetAsEntry();
          if (fsEntry.isDirectory) {
            var reader = fsEntry.createReader();
            promises.push(new Promise(function (dirResolve, dirReject) {
              reader.readEntries(function (entries) {
                var dirPromise = _this2._collectFiles(entries, fsEntry.fullPath, []);
                promises.push(dirPromise);
                dirPromise.then(function (result) {
                  grouping[fsEntry.name] = result;
                  dirResolve();
                }, dirReject);
              }, function (err) {
                LogService.warn('Failed to read directory contents for ' + fsEntry.fullPath, err);
                dirReject();
              });
            }));
          }
        };

        for (var i = 0; i < evt.dataTransfer.items.length; i++) {
          _loop(i);
        }

        Promise.all(promises).then(function () {
          LogService.debug('[RunnerClient.' + _this2.name + '] Parsed drag-drop contents:', grouping);
          resolve(grouping);
        }, reject);
      });
    }
  }, {
    key: 'target',
    get: function get() {
      return this._target;
    },
    set: function set(el) {
      if (this._target) {
        throw new Error('[RunnerClient.' + this.name + '] Cannot set more than one target!');
      }
      this._target = el;
    }
  }]);

  return DragDropService;
}();

module.exports = { DragDropService: DragDropService };