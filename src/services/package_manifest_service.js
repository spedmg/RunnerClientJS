const { FileNameValidationService } = require('./file_name_validation_service');

class PackageManifestService {
  static manifestForAsperaTransferEventData(asperaTransferEventData, packageTransferSpecs) {
    let path = asperaTransferEventData.transfer_spec.paths[0].source;
    let found = packageTransferSpecs.find((data) => { return data.transfer_spec.paths[0].source === path; });
    let files = asperaTransferEventData.files.map((fileObj) => { return fileObj.file; });
    return { id: found.asset_item_id, custom_metadata_fields: this.manifestForFiles(files, path) };
  }

  static manifestForFiles(files, path) {
    let manifestFor = (files, fullFolderPath) => {
      let folderName = this._folderNameFromFullFolderPath(fullFolderPath);
      let roots      = [];
      let tree       = { name: folderName, children: roots, count: 0};
      files.forEach((file) => {
        let filePath   = RegExp(path + '\/?(.*)').exec(file)[1];
        let components = filePath.split('/');
        let length     = components.length;
        let children   = roots;
        components.forEach((component, index) => {
          if (index === length - 1) {
            if (this._isValid(component)) {
              children.push({ name: component });
              tree.count += 1;
            }
          } else {
            let found = children.find((child) => { return child.name === component; });
            if (found) {
              children = found.children;
            } else {
              let nodeChildren = [];
              let node = { name: component, children: nodeChildren };
              children.push(node);
              children = nodeChildren;
            }
          }
        });
      });

      this._removeEmptyChildren(tree);
      return tree;
    };

    return [ { category: 'tech_info', label: 'manifest', value: manifestFor(files, path) } ];
  }

  static present(manifest) {
    let numberOfFiles = 0;
    let numberOfFolders = 0;
    let sorted = [];

    let processLevel = (level, pathComponents) => {
      let items  = [];
      let levels = [];

      level.forEach((item) => {
        if (item.hasOwnProperty('children')) {
          if (this._hasNonFolderChild(item)) {
            numberOfFolders += 1;
            levels.push(item);
          }
        } else {
          numberOfFiles += 1;
          items.push(item);
        }
      });

      let processed = this._sort(items).map((item) => {
        return pathComponents.concat(item.name).join('/');
      });

      sorted = sorted.concat(processed);
      this._sort(levels).forEach((level) => { processLevel(level.children, pathComponents.concat(level.name)); });
    };

    processLevel((manifest.children || []), []);

    return {
      numberOfFiles: numberOfFiles,
      numberOfFolders: numberOfFolders,
      sorted: sorted,
    };
  }

  ////
  // Private methods
  ////

  static _folderNameFromFullFolderPath(fullFolderPath) {
    let pathComponents = fullFolderPath.split('/');
    return pathComponents[pathComponents.length - 1];
  }

  static _hasNonFolderChild(level) {
    return level.hasOwnProperty('children') && level.children && level.children.find((item) => {
      if (item.hasOwnProperty('children')) {
        return this._hasNonFolderChild(item);
      } else {
        return true;
      }
    });
  }

  static _isValid(component) {
    let hasExtension = FileNameValidationService.containsExtension(component);
    let firstTwoCharacters = component[0] + component[1];
    return component.toLowerCase() !== '.ds_store' && firstTwoCharacters !== '._' && (!hasExtension || FileNameValidationService.containsValidExtension(component));
  }


  static _removeEmptyChildren(level) {
    level.children.forEach((item, index) => {
      if (item.children) {
        if (!item.children.length) {
          level.children.splice(index, 1);
        } else {
          this._removeEmptyChildren(item);
        }
      }
    });
  }

  static _sort(collection) {
    return collection.sort((a, b) => {
      let lowerNameA = a.name.toLowerCase();
      let lowerNameB = b.name.toLowerCase();
      if (lowerNameA < lowerNameB) {
        return -1;
      } else if (lowerNameA > lowerNameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

module.exports = { PackageManifestService };
