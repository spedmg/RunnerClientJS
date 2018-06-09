import { AsperaConnectService } from 'Services/aspera_connect_service';
import AW4 from 'asperaconnect';

const DEFAULT_EVENT_CALLBACKS = {
  all: [],
  dragEnter: [],
  dragLeave: [],
  dragOver: [],
  drop: []
};

class AsperaDragDropService {
  static addTarget(target, eventCallbacks) {
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

    this.eventCallbacks = eventCallbacks;
    this.target = target;
  }

  static reset() {
    this.target.removeEventListener('dragenter', this._dragEnterCallback);
    this.target.removeEventListener('dragleave', this._dragLeaveCallback);
    this.target.removeEventListener('dragover', this._dragOverCallback);
    this.target.removeEventListener('drop', this._dropCallback);
    this.eventCallbacks = Object.assign({}, DEFAULT_EVENT_CALLBACKS);
    this.target = undefined;
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
      '/file/dropped-files',
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
        if (typeof(entry.getFilesAndDirectories) === 'function') {
          (function (path) {
            entry.getFilesAndDirectories().then(function(childEntries) {
              process(childEntries, path, collection);
            });
          })(entry.path || path);
        } else {
          collection.push(path + '/' + entry.name);
        }
      });

      console.log(collection)
      return collection;
    };

    console.log(evt.dataTransfer);
    if (typeof(evt.dataTransfer.getFilesAndDirectories) === 'function') {
      evt.dataTransfer.getFilesAndDirectories().then(function(entries) {
        console.log(entries);
        entries.forEach(function (entry) {
          if (entry.path) {
            grouping[entry.name] = process([entry], entry.name, []);
          }
        });
      });
    }
    console.log(grouping)
    return grouping;
  }
}

export { AsperaDragDropService };
