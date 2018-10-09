'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../api'),
    API = _require.API;

var _require2 = require('./aspera_connect_service'),
    AsperaConnectService = _require2.AsperaConnectService;

var _require3 = require('./aspera_transfer_spec_formatter_service'),
    AsperaTransferSpecFormatterService = _require3.AsperaTransferSpecFormatterService;

var _require4 = require('./package_manifest_service'),
    PackageManifestService = _require4.PackageManifestService;

var AsperaUploadService = function () {
  function AsperaUploadService() {
    _classCallCheck(this, AsperaUploadService);
  }

  _createClass(AsperaUploadService, null, [{
    key: 'upload',
    value: function upload(currentFiles, options) {
      var _this = this;

      var items = currentFiles.map(function (file) {
        var attrs = {
          name: file.fileName,
          package: file.fileObj.isFolder
        };

        if (file.fileObj.fetchFolderContentsFromDragDropEvent) {
          attrs.custom_metadata_fields = PackageManifestService.manifestForFiles(file.fileObj.fetchFolderContentsFromDragDropEvent(), file.fileName);
        }

        return attrs;
      });

      return API.upload(items, options || {}).then(function (response) {
        var formatted = AsperaTransferSpecFormatterService.formatted(response.data, currentFiles);

        var result = _this.asperaConnectService.start(formatted.all, response.data.connection_settings);

        _this.activeUploads[result.id] = {
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

  }, {
    key: '_onTransferComplete',
    value: function _onTransferComplete(data) {
      var activeUpload = this.activeUploads[data.id];
      if (!activeUpload || !data.isBatchComplete) {
        return;
      }

      activeUpload.files.forEach(function (file) {
        if (file.fileObj.isFolder && !file.fileObj.fetchFolderContentsFromDragDropEvent) {
          var attrs = PackageManifestService.manifestForAsperaTransferEventData(data.transfer, activeUpload.packageMappings);
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
  }, {
    key: 'activeUploads',
    get: function get() {
      if (!this._activeUploads) {
        this._activeUploads = {};
      }
      return this._activeUploads;
    }
  }, {
    key: 'hasActiveUploads',
    get: function get() {
      return !!Object.keys(this.activeUploads).length;
    }
  }, {
    key: 'asperaConnectService',
    get: function get() {
      if (!this._asperaConnectService) {
        AsperaConnectService.eventCallbacks = {
          transferComplete: [this._onTransferComplete.bind(this)]
        };
        this._asperaConnectService = AsperaConnectService;
      }

      return this._asperaConnectService;
    }
  }]);

  return AsperaUploadService;
}();

module.exports = { AsperaUploadService: AsperaUploadService };