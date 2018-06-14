const { RestAction } = require('./rest_action');

class IngestBatchClient {
  static completeUpload(ingestBatchId) {
    return RestAction.patch(`/api/v1/ingest_batches/${ingestBatchId}/upload_complete`, {});
  }
  static getCounts(userId) {
    return RestAction.get(`/api/v1/ingest_batch_counts/${userId}`);
  }
  static getActivity(status, params) {
    return RestAction.get(`/api/v1/ingest_batch_activity/${status}`, { params: params });
  }
  static getIngestsFor(ingestBatchId) {
    return RestAction.get(`/api/v1/ingest_batch_statuses/${ingestBatchId}`);
  }
  static getAssetMetadataFor(ingestBatchId) {
    return RestAction.get(`/api/v1/ingest_batches/${ingestBatchId}/metadata`);
  }
}

module.exports = { IngestBatchClient };
