const { RestAction } = require('./rest_action');
const axios = require('axios');

const BASE_URL = '/api/v2/multipart/asset_items';

class MultipartUploadClient {
  static _buildURL (assetID, endpoint) {
    return [BASE_URL, assetID, endpoint].join('/');
  }

  static initiateAsset (assetId, partSize, uuid) {
    const url           = this._buildURL(assetId, 'initiate');
    const requestBody   = { uuid, part_size: partSize };

    return RestAction.post(url, requestBody);
  }

  static retrieveUploadUrls (assetId, partNumbers, uuid) {
    const url         = this._buildURL(assetId, 'retrieve_upload_urls');
    const requestBody = { uuid, part_numbers: partNumbers };

    return RestAction.post(url, requestBody);
  }

  static completeParts (assetId, parts, uuid) {
    const url         = this._buildURL(assetId, 'complete_parts');
    const requestBody = { parts, uuid };

    return RestAction.post(url, requestBody);
  }

  static completeAsset (assetId, uuid) {
    const url = this._buildURL(assetId, 'complete');

    return RestAction.post(url, { uuid });
  }

  static uploadFilepart (url, filepart) {
    return axios.put(url, filepart);
  }
}

module.exports = { MultipartUploadClient };
