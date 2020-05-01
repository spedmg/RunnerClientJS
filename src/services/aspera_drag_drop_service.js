const { DragDropService } = require('./drag_drop_service');
const { AsperaConnectService } = require('./aspera_connect_service');
const AW4 = window.AW4;

class AsperaDragDropService extends DragDropService {
  static addTarget(target, eventCallbacks) {
    super.addTarget(target, eventCallbacks);
    AsperaConnectService.connect.initSession();
  }

  static async dropCallback(event) {
    event.stopPropagation();
    event.preventDefault();

    let filesDropped = Array.from(event.dataTransfer.files);
    let data = {
      dataTransfer: {
        files: filesDropped.map(({ lastModifiedDate, name, size, type }) => {
          return { lastModifiedDate, name, size, type };
        })
      }
    };

    const manifest = await this._groupedFolderContents(event);
    const dragDropManifestGrouping = {};
    for (let parentDirectory in manifest) {
      dragDropManifestGrouping[parentDirectory] = Object.keys(manifest[parentDirectory]);
    }
    let dropHelper = (files) => {
      this._executeEventCallbacksFor('drop', { event, files, dragDropManifestGrouping });
    };

    AsperaConnectService.connect.connectHttpRequest(
      AW4.Connect.HTTP_METHOD.POST,
      '/connect/file/dropped-files',
      data,
      AW4.Utils.SESSION_ID,
      { success: dropHelper }
    );
  }
}

module.exports = { AsperaDragDropService };
