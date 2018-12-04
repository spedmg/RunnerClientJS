'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid/v4');
var REQUIRED_ASPERA_VERSION = '3.8.0';
var DEFAULT_EVENT_CALLBACKS = {
  transfer: [],
  transferComplete: [],
  status: [],
  start: []
};

var AsperaConnectService = function () {
  function AsperaConnectService() {
    _classCallCheck(this, AsperaConnectService);
  }

  _createClass(AsperaConnectService, null, [{
    key: 'initialize',
    value: function initialize() {
      var id = uuid();
      this.connectInstaller = new window.AW4.ConnectInstaller();
      this._connect = new window.AW4.Connect({
        id: id,
        dragDropEnabled: true,
        minVersion: REQUIRED_ASPERA_VERSION
      });
      this._connect.addEventListener(window.AW4.Connect.EVENT.STATUS, this._handleAsperaEvent.bind(this));
      this._connect.initSession(id);

      this.activeTransfers = {};
      this.uploadBatchCount = 0;
    }
  }, {
    key: 'start',
    value: function start(transferSpecs, connectionSettings) {
      var _this = this;

      this.connect.addEventListener(window.AW4.Connect.EVENT.TRANSFER, this._handleAsperaEvent.bind(this));
      var tokens = [];
      var currentPromise = void 0;
      var startTransfer = function startTransfer(transferSpec) {
        return new Promise(function (resolve, reject) {
          var result = _this.connect.startTransfer(transferSpec, connectionSettings, {
            success: resolve,
            error: reject
          });

          if (result.error) {
            reject(result.error);
          } else {
            tokens.push(result.request_id);
            result.transfer_spec = transferSpec;
            _this._executeEventListenersFor('start', result);
          }
        });
      };

      var allPromises = transferSpecs.map(function (transferSpec) {
        if (currentPromise) {
          var newPromise = currentPromise.then(function () {
            startTransfer(transferSpec);
          });
          currentPromise = newPromise;
          return newPromise;
        } else {
          currentPromise = startTransfer(transferSpec);
          return currentPromise;
        }
      });

      this.uploadBatchCount += 1;
      this.activeTransfers[this.uploadBatchCount] = tokens;

      return { id: this.uploadBatchCount, promise: Promise.all(allPromises) };
    }
  }, {
    key: 'showFileUploadDialog',
    value: function showFileUploadDialog(successCallback) {
      this.connect.showSelectFileDialog({
        success: successCallback
      });
    }
  }, {
    key: 'showFolderUploadDialog',
    value: function showFolderUploadDialog(successCallback) {
      this.connect.showSelectFolderDialog({
        success: successCallback
      });
    }
  }, {
    key: '_handleAsperaEvent',
    value: function _handleAsperaEvent(eventName, eventData) {
      if (eventName === window.AW4.Connect.EVENT.STATUS) {
        this._handleAsperaStatusEvent(eventData);
      }
      if (eventName === window.AW4.Connect.EVENT.TRANSFER) {
        this._handleAsperaTransferEvent(eventData);
      }
    }
  }, {
    key: '_executeEventListenersFor',
    value: function _executeEventListenersFor(eventName, eventData) {
      this.eventCallbacks[eventName].forEach(function (cb) {
        return cb(eventData);
      });
    }
  }, {
    key: '_handleAsperaStatusEvent',
    value: function _handleAsperaStatusEvent(eventData) {
      this._executeEventListenersFor('status', eventData);

      switch (eventData) {
        case window.AW4.Connect.STATUS.INITIALIZING:
        case window.AW4.Connect.STATUS.RETRYING:
          this.connectInstaller.showLaunching();
          break;
        case window.AW4.Connect.STATUS.FAILED:
          this.connectInstaller.showDownload();
          break;
        case window.AW4.Connect.STATUS.OUTDATED:
          this.connectInstaller.showUpdate();
          break;
        case window.AW4.Connect.STATUS.RUNNING:
          this.connectInstaller.connected();
          break;
      }
    }
  }, {
    key: '_handleAsperaTransferEvent',
    value: function _handleAsperaTransferEvent(eventData) {
      var _this2 = this;

      eventData.transfers.forEach(function (transfer) {
        if (transfer.transfer_spec) {
          _this2._executeEventListenersFor('transfer', transfer);

          var data = _this2._getTransferDataFor(transfer);
          if (data) {
            if (transfer.percentage === 1) {
              var tokens = _this2.activeTransfers[data.id];
              tokens.splice(data.index, 1);

              if (tokens.length === 0) {
                delete _this2.activeTransfers[data.id];
              }

              _this2._executeEventListenersFor('transferComplete', {
                transfer: transfer,
                id: data.id,
                token: data.token,
                isBatchComplete: !tokens.length
              });
            }
          }
        }
      });

      if (!this.hasActiveTransfers) {
        this._removeTransferListener();
      }
    }
  }, {
    key: '_getTransferDataFor',
    value: function _getTransferDataFor(transfer) {
      for (var id in this.activeTransfers) {
        if (!this.activeTransfers.hasOwnProperty(id)) {
          continue;
        }

        var tokens = this.activeTransfers[id];
        if (tokens) {
          var token = transfer.aspera_connect_settings.request_id;
          var index = tokens.indexOf(token);
          if (index !== -1) {
            return { id: id, token: token, index: index };
          }
        }
      }
    }
  }, {
    key: '_removeTransferListener',
    value: function _removeTransferListener() {
      this.connect.removeEventListener(window.AW4.Connect.EVENT.TRANSFER);
    }
  }, {
    key: 'eventCallbacks',
    set: function set(eventCallbacks) {
      this._eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS, eventCallbacks);
    },
    get: function get() {
      if (!this._eventCallbacks) {
        this._eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS);
      }
      return this._eventCallbacks;
    }
  }, {
    key: 'connect',
    get: function get() {
      if (!this._connect) {
        this.initialize();
      }
      return this._connect;
    }
  }, {
    key: 'hasActiveTransfers',
    get: function get() {
      return !!Object.keys(this.activeTransfers).length;
    }
  }]);

  return AsperaConnectService;
}();

module.exports = { AsperaConnectService: AsperaConnectService };