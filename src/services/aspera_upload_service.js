const { API } = require('../api');
const { AsperaConnectService } = require('./aspera_connect_service');
const { AsperaTransferSpecFormatterService } = require('./aspera_transfer_spec_formatter_service');
const { PackageManifestService } = require('./package_manifest_service');

class AsperaUploadService {
  static get activeUploads() {
    if (!this._activeUploads) {
      this._activeUploads = {};
    }
    return this._activeUploads;
  }

  static get hasActiveUploads() {
    return !!Object.keys(this.activeUploads).length;
  }

  static get asperaConnectService() {
    if (!this._asperaConnectService) {
      AsperaConnectService.eventCallbacks = {
        transferComplete: [this._onTransferComplete.bind(this)]
      };
      this._asperaConnectService = AsperaConnectService;
    }

    return this._asperaConnectService;
  }

  static upload(currentFiles, options) {
    let items = currentFiles.map((file) => {
      let attrs = {
        name: file.fileName,
        package: file.fileObj.isFolder,
      };

      if (file.fileObj.fetchFolderContentsFromDragDropEvent) {
        attrs.custom_metadata_fields = PackageManifestService.manifestForFiles(file.fileObj.fetchFolderContentsFromDragDropEvent(), file.fileName);
      }

      return attrs;
    });

    return API.upload(items, options || {})
      .then((response) => {
        let formatted = AsperaTransferSpecFormatterService.formatted(response.data, currentFiles);

        let result = this.asperaConnectService.start(
          formatted.all,
          response.data.connection_settings
        );

        this.activeUploads[result.id] = {
          files: currentFiles,
          assetItemAttrsCollection: [],
          packageMappings: formatted.packageMappings,
          ingestBatchId: response.data.ingest_batch_id
        };

        return response;
      });
  }

  ////
  // private methods
  ////

  /**
   * Callback executed on AW4 'transfer' event when AsperaConnectService
   * determines the transfer has completed.
   * @param {object}  data
   * @param {object}  data.transfer - transfer data from AW4.Connect
   * @param {number}  data.id - internal tracking ID for transfer batch. NOT the
   *                            runner ingest batch ID
   * @param {string}  data.token - aspera request_id
   * @param {boolean} data.isBatchComplete
   */
  static _onTransferComplete(data) {
    let activeUpload = this.activeUploads[data.id];
    if (!activeUpload || !data.isBatchComplete) { return; }

    activeUpload.files.forEach((file) => {
      if (file.fileObj.isFolder && !file.fileObj.fetchFolderContentsFromDragDropEvent) {
        let attrs = PackageManifestService.manifestForAsperaTransferEventData(
          data.transfer,
          activeUpload.packageMappings
        );
        activeUpload.assetItemAttrsCollection.push(attrs);
      }
    });

    if (activeUpload.assetItemAttrsCollection.length) {
      API.bulkUpdateAssetItems(activeUpload.assetItemAttrsCollection);
    }

    // Set asset items in the completed ingest to "uploaded"
    API.completeIngestBatchUpload(activeUpload.ingestBatchId);
    delete this.activeUploads[data.id];
  }
}

module.exports = { AsperaUploadService };
