'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./file_name_validation_service'),
    FileNameValidationService = _require.FileNameValidationService;

var _require2 = require('./file_validation_service'),
    FileValidationService = _require2.FileValidationService;

var _require3 = require('./thumbnail_validation_service'),
    ThumbnailValidationService = _require3.ThumbnailValidationService;

var FileFactory = function FileFactory(file) {
  _classCallCheck(this, FileFactory);

  this.fileName = FileValidationService.getFileName(file.name);
  this.fullFilePath = file.name;
  this.processing = false;
  this.size = file.size;
  this.fileObj = file;
  this.uuid = window.crypto.getRandomValues(new Uint32Array(1))[0];

  this.hasValidCharacters = FileNameValidationService.containsValidCharacters(this.fileName);
  this.hasExtension = FileNameValidationService.containsExtension(this.fileName);
  this.hasValidExtension = FileNameValidationService.containsValidExtension(this.fileName);

  this.valid = function () {
    return FileNameValidationService.valid(this.fileName, this.fileObj.doesNotRequireExtension);
  };

  this.validThumbnail = function () {
    var validFile = this.valid();
    var validThumbnail = ThumbnailValidationService.valid(file);

    return validFile && validThumbnail;
  };
};

module.exports = { FileFactory: FileFactory };