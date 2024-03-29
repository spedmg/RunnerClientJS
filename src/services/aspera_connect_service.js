const REQUIRED_ASPERA_VERSION = '3.10.1';
const DEFAULT_EVENT_CALLBACKS = {
  transfer: [],
  transferComplete: [],
  status: [],
  start: []
};

const generateID = () => {
  const unixTime = Math.floor(Date.now() / 1000);
  const rand = Math.floor(Math.random() * 10000);
  return `RunnerClientJS-${unixTime}-${rand}`;
};

const isBrowser = new Function('try { return this === window; }catch(e) { return false; }');

class AsperaConnectService {
  static initialize() {
    let id = generateID();
    if (!isBrowser()) { throw new Error('AsperaConnectService can only be used in browsers'); }

    this.connectInstaller = new window.AW4.ConnectInstaller(this.CONNECT_INSTALLER_OPTIONS);
    window.AW4.ConnectInstaller.supportsInstallingExtensions = true;

    let connectOptions = Object.assign({
      id: id,
      dragDropEnabled: true,
      minVersion: REQUIRED_ASPERA_VERSION
    }, this.CONNECT_OPTIONS);
    this._connect = new window.AW4.Connect(connectOptions);
    this._connect.addEventListener(window.AW4.Connect.EVENT.STATUS, this._handleAsperaEvent.bind(this));
    this._connect.initSession(id);

    this.activeTransfers = {};
    this.uploadBatchCount = 0;
  }

  static set eventCallbacks(eventCallbacks) {
    this._eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS, eventCallbacks);
  }

  static get eventCallbacks() {
    if (!this._eventCallbacks) {
      this._eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS);
    }
    return this._eventCallbacks;
  }

  static get connect() {
    if (!this._connect) {
      this.initialize();
    }
    return this._connect;
  }

  static start(transferSpecs, connectionSettings) {
    this.connect.addEventListener(window.AW4.Connect.EVENT.TRANSFER, this._handleAsperaEvent.bind(this));
    let tokens = [];

    let startTransferForIndex = (index) => {
      let result = this.connect.startTransfer(transferSpecs[index], connectionSettings, {
        success: () => {
          if (index < transferSpecs.length - 1) {
            startTransferForIndex(index + 1);
          }
          promiseFunctions[index].resolve();
        },
        error: promiseFunctions[index].reject
      });

      if (result.error) {
        promiseFunctions[index].reject(result.error);
      } else {
        tokens.push(result.request_id);
        result.transfer_spec = transferSpecs[index];
        this._executeEventListenersFor('start', result);
      }
    };

    let allPromises = [];
    let promiseFunctions = {};

    transferSpecs.forEach((transferSpec, index) => {
      let promise = new Promise((resolve, reject) => {
        promiseFunctions[index] = { resolve, reject };
      });
      allPromises.push(promise);
    });

    startTransferForIndex(0);

    this.uploadBatchCount += 1;
    this.activeTransfers[this.uploadBatchCount] = tokens;

    return { id: this.uploadBatchCount, promise: Promise.all(allPromises) };
  }

  static showFileUploadDialog(successCallback) {
    this.connect.showSelectFileDialog({
      success: successCallback
    });
  }

  static showFolderUploadDialog(successCallback) {
    this.connect.showSelectFolderDialog({
      success: successCallback
    });
  }

  static _handleAsperaEvent(eventName, eventData) {
    if (eventName === window.AW4.Connect.EVENT.STATUS)   { this._handleAsperaStatusEvent(eventData); }
    if (eventName === window.AW4.Connect.EVENT.TRANSFER) { this._handleAsperaTransferEvent(eventData); }
  }

  static _executeEventListenersFor(eventName, eventData) {
    this.eventCallbacks[eventName].forEach(cb => cb(eventData));
  }

  static _handleAsperaStatusEvent(eventData) {
    this._executeEventListenersFor('status', eventData);

    switch(eventData) {
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

  static _handleAsperaTransferEvent(eventData) {
    eventData.transfers.forEach((transfer) => {
      if (transfer.transfer_spec) {
        this._executeEventListenersFor('transfer', transfer);

        let data = this._getTransferDataFor(transfer);
        if (data) {
          if (transfer.percentage === 1) {
            let tokens = this.activeTransfers[data.id];
            tokens.splice(data.index, 1);

            if (tokens.length === 0) {
              delete(this.activeTransfers[data.id]);
            }

            this._executeEventListenersFor('transferComplete', {
              transfer: transfer,
              id: data.id,
              token: data.token,
              isBatchComplete: !tokens.length
            });
          }
        }
      }
    });

    if (!this.hasActiveTransfers) { this._removeTransferListener(); }
  }

  static get hasActiveTransfers() {
    return !!Object.keys(this.activeTransfers).length;
  }

  static _getTransferDataFor(transfer) {
    for (let id in this.activeTransfers) {
      if (!this.activeTransfers.hasOwnProperty(id)) { continue; }

      let tokens = this.activeTransfers[id];
      if (tokens) {
        let token = transfer.aspera_connect_settings.request_id;
        let index = tokens.indexOf(token);
        if (index !== -1) { return { id: id, token: token, index: index }; }
      }
    }
  }

  static _removeTransferListener() {
    this.connect.removeEventListener(window.AW4.Connect.EVENT.TRANSFER);
  }

  /**
   * Use this setter to provide non-default configuration to the
   * AW4.Connect() constructor
   */
  static set CONNECT_OPTIONS (options) {
    this.__CONNECT_OPTIONS = options;
  }

  static get CONNECT_OPTIONS () {
    return this.__CONNECT_OPTIONS || {};
  }

  /**
   * Use this setter to provide non-default configuration to the
   * AW4.ConnectInstaller() constructor
   */
  static set CONNECT_INSTALLER_OPTIONS (options) {
    this.__CONNECT_INSTALLER_OPTIONS = options;
  }

  static get CONNECT_INSTALLER_OPTIONS () {
    return this.__CONNECT_INSTALLER_OPTIONS || {};
  }
}

module.exports = { AsperaConnectService };
