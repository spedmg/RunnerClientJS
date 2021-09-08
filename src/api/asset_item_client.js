const { RestAction } = require('./rest_action');

class AssetItemClient {
  static getAssetItem (id) {
    return RestAction.get(`/api/v1/asset_items/${id}`);
  }

  static bulkUpdate (assetItems, options) {
    let body = { asset_items: assetItems };
    if (options && options.metadata) { body.metadata = options.metadata; }

    return RestAction.post('/api/v1/asset_items/bulk_update', body);
  }

  static replaceThumbnail (assetId, replacementThumbnailName) {
    let body = { filename: replacementThumbnailName };
    return RestAction.post(`/api/v1/asset_items/${assetId}/delegate_token`, body);
  }
}

module.exports = { AssetItemClient };
