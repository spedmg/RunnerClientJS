'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./rest_action'),
    RestAction = _require.RestAction;

var axios = require('axios');

var BASE_URL = '/api/v2/multipart/asset_items';

var MultipartUploadClient = function () {
  function MultipartUploadClient() {
    _classCallCheck(this, MultipartUploadClient);
  }

  _createClass(MultipartUploadClient, null, [{
    key: '_buildURL',
    value: function _buildURL(assetID, endpoint) {
      return [BASE_URL, assetID, endpoint].join('/');
    }
  }, {
    key: 'initiateAsset',
    value: function initiateAsset(assetId, partSize, uuid) {
      var url = this._buildURL(assetId, 'initiate');
      var requestBody = { uuid: uuid, part_size: partSize };

      return RestAction.post(url, requestBody);
    }
  }, {
    key: 'retrieveUploadUrls',
    value: function retrieveUploadUrls(assetId, partNumbers, uuid) {
      var url = this._buildURL(assetId, 'retrieve_upload_urls');
      var requestBody = { uuid: uuid, part_numbers: partNumbers };

      return RestAction.post(url, requestBody);
    }
  }, {
    key: 'completeParts',
    value: function completeParts(assetId, parts, uuid) {
      var url = this._buildURL(assetId, 'complete_parts');
      var requestBody = { parts: parts, uuid: uuid };

      return RestAction.post(url, requestBody);
    }
  }, {
    key: 'completeAsset',
    value: function completeAsset(assetId, uuid) {
      var url = this._buildURL(assetId, 'complete');

      return RestAction.post(url, { uuid: uuid });
    }
  }, {
    key: 'uploadFilepart',
    value: function uploadFilepart(url, filepart) {
      return axios.put(url, filepart);
    }
  }]);

  return MultipartUploadClient;
}();

module.exports = { MultipartUploadClient: MultipartUploadClient };