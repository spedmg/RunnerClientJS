'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./api/asset_item_client'),
    AssetItemClient = _require.AssetItemClient;

var _require2 = require('./api/ingest_batch_client'),
    IngestBatchClient = _require2.IngestBatchClient;

var _require3 = require('./api/upload_client'),
    UploadClient = _require3.UploadClient;

var API = function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: 'upload',
    value: function upload(objects, options) {
      return UploadClient.post(objects, options);
    }
  }, {
    key: 'completeIngestBatchUpload',
    value: function completeIngestBatchUpload(ingestBatchId) {
      return IngestBatchClient.completeUpload(ingestBatchId);
    }
  }, {
    key: 'bulkUpdateAssetItems',
    value: function bulkUpdateAssetItems(assetItems, options) {
      return AssetItemClient.bulkUpdate(assetItems, options);
    }
  }, {
    key: 'replaceThumbnail',
    value: function replaceThumbnail(assetId, replacementThumbnailName) {
      return AssetItemClient.replaceThumbnail(assetId, replacementThumbnailName);
    }
  }]);

  return API;
}();

module.exports = {
  default: API,
  API: API
};