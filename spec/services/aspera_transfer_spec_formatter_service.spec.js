import { AsperaTransferSpecFormatterService } from 'Services/aspera_transfer_spec_formatter_service';

describe('AsperaTransferSpecFormatterService', () => {
  let uploadResponseData;
  let files;

  beforeEach(() => {
    uploadResponseData = {
      transfer_spec: {
        importantConfigStuff: 'omg-important',
        paths: [
          { source: 'file-1' },
          { source: 'file-2' },
        ],
      },
      package_transfer_specs: [
        {
          asset_item_id: 123,
          transfer_spec: {
            importantConfigStuff: 'lol-important',
            paths: [
              { source: 'folder-1' },
            ],
          },
        },
        {
          asset_item_id: 456,
          transfer_spec: {
            importantConfigStuff: 'wow-important',
            paths: [
              { source: 'folder-2' },
            ],
          },
        },
      ],
    };

    files = [
      {
        fullFilePath: '/full/file/path/file-1',
        fileObj: {
          isFolder: false
        },
      },
      {
        fullFilePath: '/full/folder/path/folder-1',
        fileObj: {
          isFolder: true
        },
      },
      {
        fullFilePath: '/full/file/path/file-2',
        fileObj: {
          isFolder: false
        },
      },
      {
        fullFilePath: '/full/folder/path/folder-2',
        fileObj: {
          isFolder: true
        },
      },
    ];
  });

  specify(function () {
    let formatted = AsperaTransferSpecFormatterService.formatted(uploadResponseData, files);

    expect(formatted.all).toEqual([
      {
        importantConfigStuff: 'omg-important',
        paths: [
          { source: '/full/file/path/file-1' },
          { source: '/full/file/path/file-2' },
        ],
      },
      {
        importantConfigStuff: 'lol-important',
        paths: [
          { source: '/full/folder/path/folder-1' },
        ],
      },
      {
        importantConfigStuff: 'wow-important',
        paths: [
          { source: '/full/folder/path/folder-2' },
        ],
      },
    ]);

    expect(formatted.packageMappings).toEqual(
      [
        {
          asset_item_id: 123,
          transfer_spec: {
            importantConfigStuff: 'lol-important',
            paths: [
              { source: '/full/folder/path/folder-1' },
            ],
          },
        },
        {
          asset_item_id: 456,
          transfer_spec: {
            importantConfigStuff: 'wow-important',
            paths: [
              { source: '/full/folder/path/folder-2' },
            ],
          },
        },
      ]
    );
  });
});
