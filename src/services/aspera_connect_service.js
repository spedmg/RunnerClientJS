import AW4 from 'asperaconnect';

const REQUIRED_ASPERA_VERSION = '3.7.4';
const DEFAULT_EVENT_CALLBACKS = {
  transfer: [],
  transferComplete: [],
  status: []
};

class AsperaConnectService {
  constructor(eventCallbacks) {
    this.connect = new AW4.Connect({
      id: `RunnerClient${Math.floor(Math.random() * 10000)}`,
      dragDropEnabled: true,
      minVersion: REQUIRED_ASPERA_VERSION
    });
    this.connectInstaller = new AW4.ConnectInstaller();
    this.connect.addEventListener(AW4.Connect.EVENT.STATUS, this._handleAsperaEvent);

    this.activeTransfers = {};
    this.uploadBatchCount = 0;
    this.eventCallbacks = Object.assign(DEFAULT_EVENT_CALLBACKS, eventCallbacks);
  }

  start(transferSpecs, connectionSettings) {
    this.connect.addEventListener(AW4.Connect.EVENT.TRANSFER, this._handleAsperaEvent);

    let allPromises = [];
    let tokens      = [];

    transferSpecs.forEach((transferSpec) => {
      let promise = new Promise((resolve, reject) => {
        let result = this.connect.startTransfer(transferSpec, connectionSettings, {
          success: resolve,
          error: reject
        });

        if (result.error) {
          reject(result.error);
        } else {
          let token = transferSpec.token;
          tokens.push(token);
          // activityUploadService.addToCache(token);
        }
      });
      allPromises.push(promise);
    });

    this.uploadBatchCount += 1;
    this.activeTransfers[this.uploadBatchCount] = tokens;

    return { id: this.uploadBatchCount, promise: Promise.all(allPromises) };
  }

  _handleAsperaEvent(eventName, eventData) {
    if (eventName === AW4.Connect.EVENT.STATUS)   { this._handleAsperaStatusEvent(eventData); }
    if (eventName === AW4.Connect.EVENT.TRANSFER) { this._handleAsperaTransferEvent(eventData); }
  }

  _executeEventListenersFor(eventName, eventData) {
    this.eventCallbacks[eventName].forEach(cb => cb(eventData));
  }

  _handleAsperaStatusEvent(eventData) {
    this._executeEventListenersFor('status', eventData);

    switch(eventData) {
      case AW4.Connect.STATUS.INITIALIZING:
      case AW4.Connect.STATUS.RETRYING:
        this.connectInstaller.showLaunching();
        break;
      case AW4.Connect.STATUS.FAILED:
        this.connectInstaller.showDownload();
        break;
      case AW4.Connect.STATUS.OUTDATED:
        this.connectInstaller.showUpdate();
        break;
      case AW4.Connect.STATUS.RUNNING:
        this.connectInstaller.connected();
        break;
    }
  }

  _handleAsperaTransferEvent(eventData) {
    if (eventData.result_count > 0) {
      eventData.transfers.forEach((transfer) => {
        if (transfer.transfer_spec) {
          this._executeEventListenersFor('transfer', transfer);
          // announcerService.asperaConnectTransferEventReceived(transfer);

          let data = this._getTransferDataFor(transfer);
          if (data) {
            if (transfer.percentage === 1) {
              // activityUploadService.removeFromCache(data.token);
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
              // announcerService.asperaConnectTransferComplete({ transfer: transfer, id: data.id, isBatchComplete: !tokens.length });
            }
          }
        }
      });
    }

    if (!this.hasActiveTransfers) { this._removeTransferListener(); }
  }

  get hasActiveTransfers() {
    return !!Object.keys(this.activeTransfers).length;
  }

  _getTransferDataFor(transfer) {
    for (let id in this.activeTransfers) {
      if (!this.activeTransfers.hasOwnProperty(id)) { continue; }

      let tokens = this.activeTransfers[id];
      if (tokens) {
        let token = transfer.transfer_spec.token;
        let index = tokens.indexOf(token);
        if (index !== -1) { return { id: id, token: token, index: index }; }
      }
    }
  }

  _removeTransferListener() {
    this.connect.removeEventListener(AW4.Connect.EVENT.TRANSFER);
  }
}

export { AsperaConnectService };
