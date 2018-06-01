import { TOP_LEVEL_METADATA_FIELDS } from '../constants';
import { RestAction } from './rest_action';
import { cloneDeep, isNull } from 'lodash';

const getTopLevelFields = function (metadata) {
  let returnObj = {};

  // for every top level field, if it has a value, include it in the return collection
  TOP_LEVEL_METADATA_FIELDS.forEach(function (field) {
    if (!isNull(metadata[field])) {
      returnObj[`${field}_name`] = metadata[field];
    }
  });

  return returnObj;
};

const jsonConstructor = function (objectsForUploadCollection, folderIds, metadata) {
  let assetItems = [];
  let includeMetadata = !!metadata;
  let includeTitleMetadata = (includeMetadata && metadata.titles && metadata.titles.length);
  let topLevelFields;

  if (includeMetadata) { topLevelFields = getTopLevelFields(metadata); }

  objectsForUploadCollection.forEach(function (objData) {
    let item = cloneDeep(objData);

    if (folderIds) { item.folder_ids = folderIds; }

    if (includeMetadata) {
      item.custom_metadata_fields = metadata.custom_metadata_fields;
      if (includeTitleMetadata) {
        item.titles = metadata.titles.map(function(title) {
          let result = {
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
};

class UploadClient {
  static post(objectsForUploadCollection, options) {
    options = options || {};

    let uploadUrl = '/api/v1/uploads';

    let requestBody = {
      asset_items: jsonConstructor(objectsForUploadCollection, options.folderIds, options.metadata),
      exclude_asset_items: !!options.excludeAssetItems,
    };

    if (options.http) {
      uploadUrl = '/api/v2/uploads/http';
      delete requestBody.exclude_asset_items;
    }

    if (options.uuid) {
      requestBody.uuid  = options.uuid;
      requestBody.notes = options.notes;
    }

    let response = RestAction.post(uploadUrl, requestBody);

    return response;
  }
}

export { UploadClient };
