"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsperaFileSerializer = function () {
  function AsperaFileSerializer() {
    _classCallCheck(this, AsperaFileSerializer);
  }

  _createClass(AsperaFileSerializer, null, [{
    key: "serialize",
    value: function serialize(result) {
      var files = result.files ? result.files.dataTransfer.files : result.dataTransfer.files;

      return files.map(function (file) {
        var attrs = {
          name: file.name,
          size: file.size,
          isFolder: /directory/i.test(file.type),
          doesNotRequireExtension: true
        };

        if (attrs.isFolder && result.dragDropManifestGrouping) {
          attrs.fetchFolderContentsFromDragDropEvent = function () {
            var fileNameComponents = file.name.split(/\/|\\/);
            var fileName = fileNameComponents[fileNameComponents.length - 1];
            return result.dragDropManifestGrouping[fileName];
          };
        }

        return attrs;
      });
    }
  }]);

  return AsperaFileSerializer;
}();

module.exports = { AsperaFileSerializer: AsperaFileSerializer };