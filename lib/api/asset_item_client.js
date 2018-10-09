'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./rest_action'),
    RestAction = _require.RestAction;

var AssetItemClient = function () {
  function AssetItemClient() {
    _classCallCheck(this, AssetItemClient);
  }

  _createClass(AssetItemClient, null, [{
    key: 'bulkUpdate',
    value: function bulkUpdate(assetItems, options) {
      var body = { asset_items: assetItems };
      if (options && options.metadata) {
        body.metadata = options.metadata;
      }

      return RestAction.post('/api/v1/asset_items/bulk_update', body);
    }
  }, {
    key: 'replaceThumbnail',
    value: function replaceThumbnail(assetId, replacementThumbnailName) {
      var body = { filename: replacementThumbnailName };
      return RestAction.post('/api/v1/asset_items/' + assetId + '/delegate_token', body);
    }
  }]);

  return AssetItemClient;
}();

module.exports = { AssetItemClient: AssetItemClient };