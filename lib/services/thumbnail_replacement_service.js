'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../api'),
    API = _require.API;

var _require2 = require('./log_service'),
    LogService = _require2.LogService;

var axios = require('axios');

var ThumbnailReplacementService = function () {
  function ThumbnailReplacementService() {
    _classCallCheck(this, ThumbnailReplacementService);
  }

  _createClass(ThumbnailReplacementService, null, [{
    key: 'replaceThumbnailFor',
    value: function replaceThumbnailFor(assetItemID, file) {
      var _this = this;

      // Fetch delegate token from runner
      return API.replaceThumbnail(assetItemID, file.fileName).then(function (response) {
        LogService.debug('[' + _this.name + '] Delegate token recieved', response);
        var token = response.data.token;
        var mcsId = response.data.mcs_id;
        // Upload the image to MCS
        return _this._uploadImageToMCS(mcsId, token, file.fileObj);
      }).then(function (mcsResponse) {
        var thumbnail = mcsResponse.data.thumbnails.find(function (t) {
          return t.type === 'small';
        });
        return {
          id: assetItemID,
          thumbnail_url: thumbnail.location
        };
      });
    }
  }, {
    key: '_uploadImageToMCS',
    value: function _uploadImageToMCS(mcsId, token, file) {
      var _this2 = this;

      var data = new FormData();
      data.append('file', file);

      return axios.request({
        url: 'https://io.cimediacloud.com/assets/' + mcsId + '/coverelement/upload',
        method: 'post',
        data: data,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        onUploadProgress: function onUploadProgress(evt) {
          LogService.debug('[' + _this2.name + '] Upload Progress', evt);
        }
      });
    }
  }]);

  return ThumbnailReplacementService;
}();

module.exports = { ThumbnailReplacementService: ThumbnailReplacementService };