import { IngestBatchClient } from 'API/ingest_batch_client';
import { RestAction } from 'API/rest_action';

describe('IngestBatchClient', () => {
  beforeEach(() => {
    spyOn(RestAction, 'get').and.returnValue(Promise.resolve({ status: 200 }));
    spyOn(RestAction, 'patch').and.returnValue(Promise.resolve({ status: 204 }));
  });

  describe('getCounts', () => {
    specify(async () => {
      await IngestBatchClient.getCounts(1);
      expect(RestAction.get).toHaveBeenCalledWith('/api/v1/ingest_batch_counts/1');
    });
  });

  describe('getActivity', () => {
    specify(async () => {
      await IngestBatchClient.getActivity('scrooge', { isRich: true });
      expect(RestAction.get).toHaveBeenCalledWith('/api/v1/ingest_batch_activity/scrooge', { params: { isRich: true } });
    });
  });

  describe('getIngestsFor', () => {
    specify(async () => {
      await IngestBatchClient.getIngestsFor(1);
      expect(RestAction.get).toHaveBeenCalledWith('/api/v1/ingest_batch_statuses/1');
    });
  });

  describe('getAssetMetadataFor', () => {
    specify(async () => {
      await IngestBatchClient.getAssetMetadataFor(1);
      expect(RestAction.get).toHaveBeenCalledWith('/api/v1/ingest_batches/1/metadata');
    });
  });

  describe('completeUpload', () => {
    specify(async () => {
      await IngestBatchClient.completeUpload(1);
      expect(RestAction.patch).toHaveBeenCalledWith('/api/v1/ingest_batches/1/upload_complete', {});
    });
  });
});
