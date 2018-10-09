'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./file_factory'),
    FileFactory = _require.FileFactory;

var _require2 = require('../constants'),
    MAX_UPLOAD_COUNT = _require2.MAX_UPLOAD_COUNT;

var FileUploadService = function () {
  function FileUploadService() {
    _classCallCheck(this, FileUploadService);
  }

  _createClass(FileUploadService, null, [{
    key: 'addFiles',
    value: function addFiles(currentFiles, fileList) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        fileList = _this.removeDuplicates(currentFiles, fileList);

        if (currentFiles.length + fileList.length > MAX_UPLOAD_COUNT) {
          reject({
            error: '[RunnerClient] Too many files added. Uploads can have a maximum of ' + MAX_UPLOAD_COUNT + ' files.'
          });
        } else {
          currentFiles.push.apply(currentFiles, _toConsumableArray(fileList));
          resolve({ files: currentFiles, filesAdded: fileList.length });
        }
      });
    }
  }, {
    key: 'removeDuplicates',
    value: function removeDuplicates(currentFiles, newFileList) {
      var existingFileNames = currentFiles.map(function (file) {
        return file.fullFilePath;
      });
      var uniqueFileList = [];

      newFileList.forEach(function (file) {
        if (!existingFileNames.includes(file.name)) {
          var ffile = new FileFactory(file);
          uniqueFileList.push(ffile);
        }
      });

      return uniqueFileList;
    }
  }, {
    key: 'removeFileByUUID',
    value: function removeFileByUUID(files, uuid) {
      return new Promise(function (resolve, reject) {
        var fileIdx = files.findIndex(function (file) {
          file.uuid === uuid;
        });
        if (fileIdx) {
          resolve(files.splice(fileIdx, 1));
        } else {
          reject();
        }
      });
    }
  }]);

  return FileUploadService;
}();

module.exports = { FileUploadService: FileUploadService };