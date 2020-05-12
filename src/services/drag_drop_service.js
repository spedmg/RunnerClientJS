const { LogService } = require('./log_service');

const DEFAULT_EVENT_CALLBACKS = {
  all: [],
  dragEnter: [],
  dragLeave: [],
  dragOver: [],
  drop: []
};

class DragDropService {
  static addTarget(target, eventCallbacks) {
    this.target = target;

    let callbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS, eventCallbacks);
    let registerAll = !!callbacks.all.length;
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

  static reset() {
    this.target.removeEventListener('dragenter', this._dragEnterCallback);
    this.target.removeEventListener('dragleave', this._dragLeaveCallback);
    this.target.removeEventListener('dragover', this._dragOverCallback);
    this.target.removeEventListener('drop', this._dropCallback);
    this.eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS);
    this._target = undefined;
  }

  static get target() {
    return this._target;
  }

  static set target(el) {
    if (this._target) {
      throw new Error(`[RunnerClient.${this.name}] Cannot set more than one target!`);
    }
    this._target = el;
  }

  static dragEnterCallback(event) {
    event.stopPropagation();
    event.preventDefault();
    this._executeEventCallbacksFor('dragEnter', { event: event });
  }

  static dragLeaveCallback(event) {
    event.stopPropagation();
    event.preventDefault();
    this._executeEventCallbacksFor('dragLeave', { event: event });
  }

  static dragOverCallback(event) {
    event.stopPropagation();
    event.preventDefault();
    this._executeEventCallbacksFor('dragOver', { event: event });
  }

  static async dropCallback(event) {
    event.stopPropagation();
    event.preventDefault();

    const dragDropManifestGrouping = await this._groupedFolderContents(event);
    this._executeEventCallbacksFor('drop', { event, dragDropManifestGrouping });
  }

  static _executeEventCallbacksFor(eventName, data) {
    this.eventCallbacks[eventName].forEach((cb) => { cb(data); });
    this.eventCallbacks.all.forEach((cb) => { cb(data); });
  }

  static _collectFiles(entries, path, collection) {
    let promises = [];
    return new Promise((resolve) => {
      entries.forEach((entry) => {
        if (entry.isDirectory) {
          let promise = new Promise((readResolve, readReject) => {
            let reader = entry.createReader();
            let readEntries = () => {
              reader.readEntries((childEntries) => {
                if (childEntries.length) {
                  let childReadPromise = this._collectFiles(childEntries, entry.fullPath, collection);
                  promises.push(childReadPromise);
                  readEntries();
                } else {
                  readResolve();
                }
              }, (err) => {
                LogService.warn(`Failed to read directory contents for ${entry.fullPath}`, err);
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

      Promise.all(promises).then(() => {
        resolve(collection);
      });
    });
  }

  static _groupedFolderContents(evt) {
    return new Promise((resolve, reject) => {
      let grouping = {};
      let promises = [];

      // IE & Safari don't support the `items` property
      if (!evt.dataTransfer.items) { resolve(grouping); }

      for (let i = 0; i < evt.dataTransfer.items.length; i++) {
        let item = evt.dataTransfer.items[i];
        let fsEntry = item.webkitGetAsEntry();
        if (fsEntry.isDirectory) {
          let reader = fsEntry.createReader();
          promises.push(new Promise((dirResolve, dirReject) => {
            reader.readEntries((entries) => {
              let dirPromise = this._collectFiles(entries, fsEntry.fullPath, []);
              promises.push(dirPromise);
              dirPromise.then((result) => {
                grouping[fsEntry.name] = result;
                dirResolve();
              }, dirReject);
            }, (err) => {
              LogService.warn(`Failed to read directory contents for ${fsEntry.fullPath}`, err);
              dirReject();
            });
          }));
        }
      }

      Promise.all(promises).then(() => {
        LogService.debug(`[RunnerClient.${this.name}] Parsed drag-drop contents:`, grouping);
        resolve(grouping);
      }, reject);
    });
  }
}

module.exports = { DragDropService };
