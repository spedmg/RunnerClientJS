import { AssetItemClient } from 'API/asset_item_client';
import { IngestBatchClient } from 'API/ingest_batch_client';
import { UploadClient } from 'API/upload_client';

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
}

export { API };
export default API;
