'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../constants'),
    TOP_LEVEL_METADATA_FIELDS = _require.TOP_LEVEL_METADATA_FIELDS;

var _require2 = require('./rest_action'),
    RestAction = _require2.RestAction;

var cloneDeep = require('lodash/cloneDeep');
var isNull = require('lodash/isNull');

var UploadClient = function () {
  function UploadClient() {
    _classCallCheck(this, UploadClient);
  }

  _createClass(UploadClient, null, [{
    key: 'post',
    value: function post(objectsForUploadCollection, options) {
      options = options || {};

      var uploadUrl = '/api/v1/uploads';

      var requestBody = {
        asset_items: this._jsonConstructor(objectsForUploadCollection, options.folderIds, options.metadata),
        exclude_asset_items: !!options.excludeAssetItems
      };

      if (options.http) {
        uploadUrl = '/api/v2/uploads/http';
        delete requestBody.exclude_asset_items;
      }

      if (options.uuid) {
        requestBody.uuid = options.uuid;
        requestBody.notes = options.notes;
      }

      var response = RestAction.post(uploadUrl, requestBody);

      return response;
    }
  }, {
    key: '_jsonConstructor',
    value: function _jsonConstructor(objectsForUploadCollection, folderIds, metadata) {
      var assetItems = [];
      var includeMetadata = !!metadata;
      var includeTitleMetadata = includeMetadata && metadata.titles && metadata.titles.length;
      var topLevelFields = void 0;

      if (includeMetadata) {
        topLevelFields = this._getTopLevelFields(metadata);
      }

      objectsForUploadCollection.forEach(function (objData) {
        var item = cloneDeep(objData);

        if (folderIds) {
          item.folder_ids = folderIds;
        }

        if (includeMetadata) {
          item.custom_metadata_fields = metadata.custom_metadata_fields;
          if (includeTitleMetadata) {
            item.titles = metadata.titles.map(function (title) {
              var result = {
                gpms_id: title.gpms_id
              };

              if (title.alpha && title.alpha.alpha_id) {
                result.alpha_id = title.alpha.alpha_id;
              }

              return result;
            });
          }

          Object.assign(item, topLevelFields);
        }

        assetItems.push(item);
      });

      return assetItems;
    }
  }, {
    key: '_getTopLevelFields',
    value: function _getTopLevelFields(metadata) {
      var returnObj = {};

      // for every top level field, if it has a value, include it in the return collection
      TOP_LEVEL_METADATA_FIELDS.forEach(function (field) {
        if (!isNull(metadata[field])) {
          returnObj[field + '_name'] = metadata[field];
        }
      });

      return returnObj;
    }
  }]);

  return UploadClient;
}();

module.exports = { UploadClient: UploadClient };