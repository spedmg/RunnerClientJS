'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./file_name_validation_service'),
    FileNameValidationService = _require.FileNameValidationService;

var PackageManifestService = function () {
  function PackageManifestService() {
    _classCallCheck(this, PackageManifestService);
  }

  _createClass(PackageManifestService, null, [{
    key: 'manifestForAsperaTransferEventData',
    value: function manifestForAsperaTransferEventData(asperaTransferEventData, packageTransferSpecs) {
      var path = asperaTransferEventData.transfer_spec.paths[0].source;
      var found = packageTransferSpecs.find(function (data) {
        return data.transfer_spec.paths[0].source === path;
      });
      var files = asperaTransferEventData.files.map(function (fileObj) {
        return fileObj.file;
      });
      return { id: found.asset_item_id, custom_metadata_fields: this.manifestForFiles(files, path) };
    }
  }, {
    key: 'manifestForFiles',
    value: function manifestForFiles(files, path) {
      var _this = this;

      var manifestFor = function manifestFor(files, fullFolderPath) {
        var folderName = _this._folderNameFromFullFolderPath(fullFolderPath);
        var roots = [];
        var tree = { name: folderName, children: roots, count: 0 };
        files.forEach(function (file) {
          var filePath = RegExp(path + '\/?(.*)').exec(file)[1];
          var components = filePath.split('/');
          var length = components.length;
          var children = roots;
          components.forEach(function (component, index) {
            if (index === length - 1) {
              if (_this._isValid(component)) {
                children.push({ name: component });
                tree.count += 1;
              }
            } else {
              var found = children.find(function (child) {
                return child.name === component;
              });
              if (found) {
                children = found.children;
              } else {
                var nodeChildren = [];
                var node = { name: component, children: nodeChildren };
                children.push(node);
                children = nodeChildren;
              }
            }
          });
        });

        _this._removeEmptyChildren(tree);
        return tree;
      };

      return [{ category: 'tech_info', label: 'manifest', value: manifestFor(files, path) }];
    }
  }, {
    key: 'present',
    value: function present(manifest) {
      var _this2 = this;

      var numberOfFiles = 0;
      var numberOfFolders = 0;
      var sorted = [];

      var processLevel = function processLevel(level, pathComponents) {
        var items = [];
        var levels = [];

        level.forEach(function (item) {
          if (item.hasOwnProperty('children')) {
            if (_this2._hasNonFolderChild(item)) {
              numberOfFolders += 1;
              levels.push(item);
            }
          } else {
            numberOfFiles += 1;
            items.push(item);
          }
        });

        var processed = _this2._sort(items).map(function (item) {
          return pathComponents.concat(item.name).join('/');
        });

        sorted = sorted.concat(processed);
        _this2._sort(levels).forEach(function (level) {
          processLevel(level.children, pathComponents.concat(level.name));
        });
      };

      processLevel(manifest.children || [], []);

      return {
        numberOfFiles: numberOfFiles,
        numberOfFolders: numberOfFolders,
        sorted: sorted
      };
    }

    ////
    // Private methods
    ////

  }, {
    key: '_folderNameFromFullFolderPath',
    value: function _folderNameFromFullFolderPath(fullFolderPath) {
      var pathComponents = fullFolderPath.split('/');
      return pathComponents[pathComponents.length - 1];
    }
  }, {
    key: '_hasNonFolderChild',
    value: function _hasNonFolderChild(level) {
      var _this3 = this;

      return level.hasOwnProperty('children') && level.children && level.children.find(function (item) {
        if (item.hasOwnProperty('children')) {
          return _this3._hasNonFolderChild(item);
        } else {
          return true;
        }
      });
    }
  }, {
    key: '_isValid',
    value: function _isValid(component) {
      var hasExtension = FileNameValidationService.containsExtension(component);
      var firstTwoCharacters = component[0] + component[1];
      return component.toLowerCase() !== '.ds_store' && firstTwoCharacters !== '._' && (!hasExtension || FileNameValidationService.containsValidExtension(component));
    }
  }, {
    key: '_removeEmptyChildren',
    value: function _removeEmptyChildren(level) {
      var _this4 = this;

      level.children.forEach(function (item, index) {
        if (item.children) {
          if (!item.children.length) {
            level.children.splice(index, 1);
          } else {
            _this4._removeEmptyChildren(item);
          }
        }
      });
    }
  }, {
    key: '_sort',
    value: function _sort(collection) {
      return collection.sort(function (a, b) {
        var lowerNameA = a.name.toLowerCase();
        var lowerNameB = b.name.toLowerCase();
        if (lowerNameA < lowerNameB) {
          return -1;
        } else if (lowerNameA > lowerNameB) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }]);

  return PackageManifestService;
}();

module.exports = { PackageManifestService: PackageManifestService };