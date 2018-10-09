'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../constants'),
    VALID_THUMBNAIL_FILE_EXTENSIONS = _require.VALID_THUMBNAIL_FILE_EXTENSIONS,
    MAX_THUMBNAIL_SIZE = _require.MAX_THUMBNAIL_SIZE;

var _require2 = require('./file_validation_service'),
    FileValidationService = _require2.FileValidationService;

var ThumbnailValidationService = function () {
  function ThumbnailValidationService() {
    _classCallCheck(this, ThumbnailValidationService);
  }

  _createClass(ThumbnailValidationService, null, [{
    key: 'containsValidExtension',
    value: function containsValidExtension(fileName) {
      return VALID_THUMBNAIL_FILE_EXTENSIONS.includes(FileValidationService.getExtension(fileName));
    }
  }, {
    key: 'isValidFileSize',
    value: function isValidFileSize(fileSize) {
      return fileSize <= MAX_THUMBNAIL_SIZE;
    }
  }, {
    key: 'valid',
    value: function valid(file) {
      return this.containsValidExtension(file.name) && this.isValidFileSize(file.size);
    }
  }]);

  return ThumbnailValidationService;
}();

module.exports = { ThumbnailValidationService: ThumbnailValidationService };