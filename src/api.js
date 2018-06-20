const { AssetItemClient } = require('./api/asset_item_client');
const { IngestBatchClient } = require('./api/ingest_batch_client');
const { UploadClient } = require('./api/upload_client');

class API {
  static upload(objects, options) {
    return UploadClient.post(objects, options);
  }

  static completeIngestBatchUpload(ingestBatchId) {
    return IngestBatchClient.completeUpload(ingestBatchId);
  }

  static bulkUpdateAssetItems(assetItems, options) {
    return AssetItemClient.bulkUpdate(assetItems, options);
  }

  static replaceThumbnail(assetId, replacementThumbnailName) {
    return AssetItemClient.replaceThumbnail(assetId, replacementThumbnailName);
  }
}

module.exports = {
  default: API,
  API
};
