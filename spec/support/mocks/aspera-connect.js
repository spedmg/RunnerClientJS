// jshint ignore:start
const AW4 = {
  Connect: function () {
    'use strict';

    let registeredListeners = {};
    let transferCount = 0;

    this.addEventListener = function (eventName, callback) {
      registeredListeners[eventName] = callback;
    };
    this.getStatus = function () {
      return 'RUNNING';
    };
    this.connectHttpRequest = function (method, path, data, sessionId, callbacks) {
      callbacks.success({ files: [] });
    };
    this.initSession = function () { };
    this.plugin = function () { };
    this.removeEventListener = function () { };
    this.setDragDropTargets = function () { };
    this.startTransfer = function (_transferSpec, _connectionSettings, callbacks) {
      if (callbacks.success) {
        callbacks.success({
          transfer_specs: [], // should contain objects with uuid for transfers
        });
      }
      return {};
    };
    this.triggerUploadCompleteEvent = function () {
      let callback = registeredListeners.transfer;
      if (!callback) { return; }

      let uuid = 'scrooge-mcduck-transfer-' + (++transferCount);
      let eventName = 'transfer';
      let mockTransferSpec = { paths:
        {
          find: function () { return true; },
        }
      };

      // started event
      callback(eventName, {
        result_count: 1,
        transfers: [
          { percentage: 0, uuid: uuid, transfer_spec: mockTransferSpec },
        ],
      });

      // finished event
      callback(eventName, {
        result_count: 1,
        transfers: [
          { percentage: 1, uuid: uuid, transfer_spec: mockTransferSpec },
        ],
      });

      // clear everything out
      callback(eventName, { result_count: 0, transfers: [] });
      registeredListeners = {};
    };
  },
  ConnectInstaller: function () {
    'use strict';

    this.addEventListener = function () { };
    this.showDownload = function () {};
    this.showUpdate = function () {};
  },
  Utils: {
    SESSION_ID: `Foobar${Math.floor(Math.random() * 10000)}`,
    BROWSER: {
      EDGE: false
    },
    generateUuid: () => { return 'random-uuid'; }
  }
};

AW4.Connect.EVENT = {
  STATUS: 'status',
  TRANSFER: 'transfer'
};

AW4.Connect.HTTP_METHOD = {
  POST: 'POST',
};

AW4.Connect.STATUS = {
  INITIALIZING : 'INITIALIZING',
  RETRYING : 'RETRYING',
  RUNNING : 'RUNNING',
  OUTDATED : 'OUTDATED',
  FAILED : 'FAILED'
};

window.AW4 = AW4;
