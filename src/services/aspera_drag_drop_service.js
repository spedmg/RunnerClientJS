const { AsperaConnectService } = require('./aspera_connect_service');
const { LogService } = require('./log_service');
const AW4 = window.AW4;

const DEFAULT_EVENT_CALLBACKS = {
  all: [],
  dragEnter: [],
  dragLeave: [],
  dragOver: [],
  drop: []
};

class AsperaDragDropService {
  static addTarget(target, eventCallbacks) {
    AsperaConnectService.connect.initSession();
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
      throw new Error('[RunnerClient.AsperaDragDropService] Cannot set more than one target!');
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

  static dropCallback(event) {
    event.stopPropagation();
    event.preventDefault();

    let manifestGrouping = this._groupedFolderContents(event);
    let filesDropped = event.dataTransfer.files;
    let data = {};
    data.dataTransfer = {};
    data.dataTransfer.files = [];
    for (let i = 0; i < filesDropped.length; i++) {
      let fileObject  = {
        'lastModifiedDate' : filesDropped[i].lastModifiedDate,
        'name'             : filesDropped[i].name,
        'size'             : filesDropped[i].size,
        'type'             : filesDropped[i].type,
      };
      data.dataTransfer.files.push(fileObject);
    }
    let dropHelper = (response) => {
      this._executeEventCallbacksFor(
        'drop',
        { event: event, files: response, dragDropManifestGrouping: manifestGrouping }
      );
    };

    AsperaConnectService.connect.connectHttpRequest(
      AW4.Connect.HTTP_METHOD.POST,
      '/connect/file/dropped-files',
      data,
      AW4.Utils.SESSION_ID,
      { success: dropHelper }
    );
  }

  static _executeEventCallbacksFor(eventName, data) {
    this.eventCallbacks[eventName].forEach((cb) => { cb(data); });
    this.eventCallbacks.all.forEach((cb) => { cb(data); });
  }

  static _groupedFolderContents(evt) {
    let grouping = {};
    let process = function(entries, path, collection) {
      entries.forEach(function (entry) {
        if (entry.isDirectory) {
          ((path) => {
            let reader = entry.createReader();
            reader.readEntries((childEntries) => {
              process(childEntries, path, collection);
            }, (err) => {
              LogService.warn(`Failed to read directory contents for ${entry.fullPath}`, err);
            });
          })(entry.fullPath || path);
        } else {
          collection.push(path + '/' + entry.name);
        }
      });

      return collection;
    };

    // IE & Safari don't support the `items` property
    if (!evt.dataTransfer.items) { return grouping; }

    for (let i = 0; i < evt.dataTransfer.items.length; i++) {
      let item = evt.dataTransfer.items[i];
      let fsEntry = item.webkitGetAsEntry();
      if (fsEntry.isDirectory) {
        let reader = fsEntry.createReader();
        reader.readEntries((entries) => {
          grouping[fsEntry.name] = process(entries, fsEntry.fullPath, []);
        }, (err) => {
          LogService.warn(`Failed to read directory contents for ${fsEntry.fullPath}`, err);
        });
      }
    }

    return grouping;
  }
}

module.exports = { AsperaDragDropService };
