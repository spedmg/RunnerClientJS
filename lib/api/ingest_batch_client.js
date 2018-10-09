'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./rest_action'),
    RestAction = _require.RestAction;

var IngestBatchClient = function () {
  function IngestBatchClient() {
    _classCallCheck(this, IngestBatchClient);
  }

  _createClass(IngestBatchClient, null, [{
    key: 'completeUpload',
    value: function completeUpload(ingestBatchId) {
      return RestAction.patch('/api/v1/ingest_batches/' + ingestBatchId + '/upload_complete', {});
    }
  }, {
    key: 'getCounts',
    value: function getCounts(userId) {
      return RestAction.get('/api/v1/ingest_batch_counts/' + userId);
    }
  }, {
    key: 'getActivity',
    value: function getActivity(status, params) {
      return RestAction.get('/api/v1/ingest_batch_activity/' + status, { params: params });
    }
  }, {
    key: 'getIngestsFor',
    value: function getIngestsFor(ingestBatchId) {
      return RestAction.get('/api/v1/ingest_batch_statuses/' + ingestBatchId);
    }
  }, {
    key: 'getAssetMetadataFor',
    value: function getAssetMetadataFor(ingestBatchId) {
      return RestAction.get('/api/v1/ingest_batches/' + ingestBatchId + '/metadata');
    }
  }]);

  return IngestBatchClient;
}();

module.exports = { IngestBatchClient: IngestBatchClient };