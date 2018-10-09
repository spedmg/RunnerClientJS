'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cloneDeep = require('lodash/cloneDeep');

var AsperaTransferSpecFormatterService = function () {
  function AsperaTransferSpecFormatterService() {
    _classCallCheck(this, AsperaTransferSpecFormatterService);
  }

  _createClass(AsperaTransferSpecFormatterService, null, [{
    key: 'formatted',
    value: function formatted(uploadResponseData, files) {
      var nonPackageTransferSpec = cloneDeep(uploadResponseData.transfer_spec);
      var packageIndex = 0;
      var fileIndex = 0;
      var collection = nonPackageTransferSpec.paths.length ? [nonPackageTransferSpec] : [];
      var packageMappings = cloneDeep(uploadResponseData.package_transfer_specs);

      files.forEach(function (file) {
        var target = void 0;

        if (file.fileObj.isFolder) {
          var packageTransferSpec = packageMappings[packageIndex].transfer_spec;
          collection.push(packageTransferSpec);
          target = packageTransferSpec.paths[0];
          packageIndex += 1;
        } else {
          target = nonPackageTransferSpec.paths[fileIndex];
          fileIndex += 1;
        }

        target.source = file.fullFilePath;
      });

      return { all: collection, packageMappings: packageMappings };
    }
  }]);

  return AsperaTransferSpecFormatterService;
}();

module.exports = { AsperaTransferSpecFormatterService: AsperaTransferSpecFormatterService };