const { AsperaConnectService } = require('./aspera_connect_service');
const { LogService } = require('./log_service');

class AsperaDragDropService {
  static addTarget(element, eventCallbacks) {
    this.element = element;
    let key = 'drag-drop-element';
    let value = Number(new Date());
    element.setAttribute(key, value);
    let selector = `[${key}="${value}"]`;

    this.dropListener = this._dropListener.bind(this);
    element.addEventListener('drop', this.dropListener);

    AsperaConnectService.connect.setDragDropTargets(selector, { dragEnter: true, dragLeave: true, drop: true }, (result) => {
      let eventType = result.event.type;
      let listeners = eventCallbacks[eventType];
      (listeners || []).forEach((listener) => {
        if (eventType === 'drop') {
          let promiseKey = this._promiseKeyFor(result.event);
          this.promises[promiseKey].then((manifestGrouping) => {
            result.dragDropManifestGrouping = manifestGrouping;
            listener(result);
            delete this.promises[promiseKey];
          });
        } else {
          listener(result);
        }
      });
    });
  }

  static get promises() {
    if (!this._promises) {
      this._promises = {};
    }
    return this._promises;
  }

  static reset() {
    this.element.removeEventListener('drop', this.dropListener);
    this._promises = {};
  }

  static _promiseKeyFor(event) {
    return event.type + event.timeStamp;
  }

  static _dropListener() {
    this.promises[this._promiseKeyFor(event)] = this._groupedFolderContents(event);
  }

  static _groupedFolderContents(evt) {
    return new Promise((resolve, reject) => {
      let grouping = {};

      if (!evt.dataTransfer.items) { resolve(grouping); }

      let length = evt.dataTransfer.items.length;
      let remaining = length;

      for (let i = 0; i < length; i++) {
        let item = evt.dataTransfer.items[i];
        let entry = item.webkitGetAsEntry();
        this._processEntry(entry, grouping).then(() => {
          remaining--;
          if (!remaining) {
            LogService.debug('[RunnerClient.AsperaDragDropService] Parsed drag-drop contents:', grouping);
            resolve(grouping);
          }
        }, (err) => {
          LogService.warn(`Failed to read directory contents for ${entry.fullPath}`, err);
          reject(err);
        });
      }
    });
  }

  static _processEntry(topLevelEntry, grouping) {
    return new Promise((resolve, reject) => {
      let key = topLevelEntry.name;
      let directoryCount = 0;
      let processEntries = (entries) => {
        entries.forEach((entry) => {
          if (entry.isDirectory) {
            directoryCount++;
            let read = (reader) => {
              reader.readEntries((childEntries) => {
                if (childEntries.length) {
                  processEntries(childEntries);
                  read(reader);
                } else {
                  directoryCount--;
                  if (!directoryCount) { resolve(); }
                }
              }, (err) => {
                LogService.warn(`Failed to read directory contents for ${entry.fullPath}`, err);
                reject(err);
              });
            };

            read(entry.createReader());
          } else {
            grouping[key] = grouping[key] || [];
            grouping[key].push(entry.fullPath);
            if (entry === topLevelEntry) { resolve(); }
          }
        });
      };

      processEntries([topLevelEntry]);
    });
  }
}

module.exports = { AsperaDragDropService };
