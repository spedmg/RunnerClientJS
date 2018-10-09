class AsperaFileSerializer {
  static serialize(result) {
    let files = result.files ? result.files.dataTransfer.files : result.dataTransfer.files;

    return files.map((file) => {
      let attrs = {
        name: file.name,
        size: file.size,
        isFolder: /directory/i.test(file.type),
        doesNotRequireExtension: true,
      };

      if (attrs.isFolder && result.dragDropManifestGrouping) {
        attrs.fetchFolderContentsFromDragDropEvent = function () {
          let fileNameComponents = file.name.split(/\/|\\/);
          let fileName = fileNameComponents[fileNameComponents.length - 1];
          return result.dragDropManifestGrouping[fileName];
        };
      }

      return attrs;
    });
  }
}

module.exports = { AsperaFileSerializer };
