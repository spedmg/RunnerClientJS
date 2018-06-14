const { RestAction } = require('./rest_action');

class AssetItemClient {
  static bulkUpdate(assetItems, options) {
    let body = { asset_items: assetItems };
    if (options && options.metadata) { body.metadata = options.metadata; }

    return RestAction.post('/api/v1/asset_items/bulk_update', body);
  }
}

module.exports = { AssetItemClient };
