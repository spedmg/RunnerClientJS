'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../constants'),
    UNSUPPORTED_FILE_EXTENSIONS = _require.UNSUPPORTED_FILE_EXTENSIONS;

var _require2 = require('./file_validation_service'),
    FileValidationService = _require2.FileValidationService;

var FileNameValidationService = function () {
  function FileNameValidationService() {
    _classCallCheck(this, FileNameValidationService);
  }

  _createClass(FileNameValidationService, null, [{
    key: 'containsValidCharacters',
    value: function containsValidCharacters(fileName) {
      return !/:|\/|"|;|'|\?|!|>|<|&|\||\*|@/.test(fileName);
    }
  }, {
    key: 'containsExtension',
    value: function containsExtension(fileName) {
      return !!FileValidationService.getExtension(fileName);
    }
  }, {
    key: 'containsValidExtension',
    value: function containsValidExtension(fileName) {
      return !UNSUPPORTED_FILE_EXTENSIONS.includes(FileValidationService.getExtension(fileName));
    }
  }, {
    key: 'valid',
    value: function valid(fileName, doesNotRequireExtension) {
      if (doesNotRequireExtension) {
        return this.containsValidCharacters(fileName);
      } else {
        return this.containsValidCharacters(fileName) && this.containsExtension(fileName) && this.containsValidExtension(fileName);
      }
    }
  }]);

  return FileNameValidationService;
}();

module.exports = { FileNameValidationService: FileNameValidationService };