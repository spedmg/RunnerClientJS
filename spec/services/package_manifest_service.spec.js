import { PackageManifestService } from 'Services/package_manifest_service';

describe('PackageManifestService', () => {
  describe('manifestForAsperaTransferEventData', function () {
    beforeEach(function () {
      this.uploadConfigResponse = {
        transfer_spec: {
          paths: [
            'file-1',
            'file-2',
          ],
        },
        package_transfer_specs: [
          {
            asset_item_id: 123,
            transfer_spec: {
              paths: [
                {
                  source: '/full/folder/path/scrooge-folder'
                },
              ],
            },
          },
          {
            asset_item_id: 456,
            transfer_spec: {
              paths: [
                {
                  source: '/full/folder/path/glomgold-folder'
                },
              ],
            },
          }
        ],
      };

      this.asperaTransferEventData = {
        files: [
          { file: '/full/folder/path/scrooge-folder/lucky-dime.mov' },
          { file: '/full/folder/path/scrooge-folder/.DS_Store' },
          { file: '/full/folder/path/scrooge-folder/._wut' },
          { file: '/full/folder/path/scrooge-folder/number-one-dime.txt' },
          { file: '/full/folder/path/scrooge-folder/ducktales/dime-enough-for-luck.mov' },
          { file: '/full/folder/path/scrooge-folder/ducktales/favorites/duck-to-the-future.mov' },
          { file: '/full/folder/path/scrooge-folder/ducktales/favorites/bad-duck-to-the-future.exe' },
          { file: '/full/folder/path/scrooge-folder/ducktales/favorites/much-ado-about-scrooge.mov' },
        ],
        transfer_spec: {
          paths: [
            {
              source: '/full/folder/path/scrooge-folder',
            }
          ],
        },
      };
    });

    specify(function () {
      let manifest = PackageManifestService.manifestForAsperaTransferEventData(this.asperaTransferEventData, this.uploadConfigResponse.package_transfer_specs);
      expect(manifest).toEqual({ id: 123, custom_metadata_fields: [
        {
          category: 'tech_info',
          label: 'manifest',
          value: {
            name: 'scrooge-folder',
            children: [
              { name: 'lucky-dime.mov' },
              { name: 'number-one-dime.txt' },
              { name: 'ducktales', children: [
                { name: 'dime-enough-for-luck.mov' },
                { name: 'favorites', children: [
                  { name: 'duck-to-the-future.mov' },
                  { name: 'much-ado-about-scrooge.mov' },
                ] },
              ] },
            ],
            count: 5,
          }
        }
      ]});
    });
  });

  describe('manifestForFiles', function () {
    beforeEach(function () {
      this.folderListing = [
        '/full/folder/path/scrooge-folder/scrooge-folder/lucky-dime.mov',
        '/full/folder/path/scrooge-folder/scrooge-folder/.DS_Store',
        '/full/folder/path/scrooge-folder/scrooge-folder/._wut',
        '/full/folder/path/scrooge-folder/scrooge-folder/number-one-dime.txt',
        '/full/folder/path/scrooge-folder/scrooge-folder/ducktales/dime-enough-for-luck.mov',
        '/full/folder/path/scrooge-folder/scrooge-folder/ducktales/favorites/duck-to-the-future.mov',
        '/full/folder/path/scrooge-folder/scrooge-folder/ducktales/favorites/bad-duck-to-the-future.exe',
        '/full/folder/path/scrooge-folder/scrooge-folder/ducktales/favorites/much-ado-about-scrooge.mov',
      ];
    });

    specify(function () {
      let manifest = PackageManifestService.manifestForFiles(this.folderListing, 'scrooge-folder');
      expect(manifest).toEqual([
        {
          category: 'tech_info',
          label: 'manifest',
          value: {
            name: 'scrooge-folder',
            children: [
              { name: 'scrooge-folder', children: [
                { name: 'lucky-dime.mov' },
                { name: 'number-one-dime.txt' },
                { name: 'ducktales', children: [
                  { name: 'dime-enough-for-luck.mov' },
                  { name: 'favorites', children: [
                    { name: 'duck-to-the-future.mov' },
                    { name: 'much-ado-about-scrooge.mov' },
                  ] },
                ] },
              ] },
            ],
            count: 5,
          }
        }
      ]);
    });
  });

  describe('present', function () {
    beforeEach(function () {
      this.manifest = {
        name: 'scrooge-folder', children: [
          { name: 'number-one-dime.txt' },
          { name: 'lucky-dime.mov' },
          { name: 'scroogetales', children: [
            { name: 'Horse Scents.mov' },
          ] },
          { name: 'quacktales', children: [
            { name: 'Down & Out in Duckburg.mp4' },
          ] },
          { name: 'Ducktales', children: [
            { name: 'A Duck Tales Valentine (Amour or Less).mov' },
            { name: 'other', children: [
              { name: 'the-magic-harp.mov' },
            ] },
            { name: 'favorites', children: [
              { name: 'MUCH-ado-about-scrooge.mov' },
              { name: 'duck-to-the-future.mov' },
            ] },
            { name: 'New Gizmo-Kids on the Block.mov' },
            { name: 'dime-enough-for-luck.mov' },
          ] },
        ],
      };
      this.presented = PackageManifestService.present(this.manifest);
    });

    it('knows the number of folders', function () {
      expect(this.presented.numberOfFolders).toEqual(5);
    });

    it('knows the number of files', function () {
      expect(this.presented.numberOfFiles).toEqual(10);
    });

    it('sorts the contents', function () {
      expect(this.presented.sorted).toEqual([
        'lucky-dime.mov',
        'number-one-dime.txt',
        'Ducktales/A Duck Tales Valentine (Amour or Less).mov',
        'Ducktales/dime-enough-for-luck.mov',
        'Ducktales/New Gizmo-Kids on the Block.mov',
        'Ducktales/favorites/duck-to-the-future.mov',
        'Ducktales/favorites/MUCH-ado-about-scrooge.mov',
        'Ducktales/other/the-magic-harp.mov',
        'quacktales/Down & Out in Duckburg.mp4',
        'scroogetales/Horse Scents.mov',
      ]);
    });
  });
});
