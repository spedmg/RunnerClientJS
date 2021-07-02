**FOR SPE INTERNAL USE ONLY**

RunnerClient.js
===============

A JavaScript library for interactions with the Sony Pictures Compass API.

## Module usage

Modules can be accessed directly from the package source. The main entrypoint is
`runnerclient`, with submodules in the `src`(ES6) directory.

```javascript
// using ES7 imports:
import RunnerClient from 'runnerclient';
import { PackageManifestService } from 'runnerclient/src/services/package_manifest_service';

// using require:
const RunnerClient = require('runnerclient');
const { PackageManifestService } = require('runnerclient/lib/services/package_manifest_service');
```

## Browser Usage

Packages for browser usage are in the `dist` directory.

```html
<!-- Provides RunnerClient library including API methods + constants -->
<script src="runner_client.api.js"></script>
<script>
  RunnerClient.configure(...args); // See below
  RunnerClient.API.upload(...args);
</script>
```

## Configuration

You'll need a token provided via the Compass API to make requests. Consult the [Compass API docs](https://developers.sonypicturesrunner.com/#oauth2-password-grant) for more information.

**Please ensure you're not exposing your Compass Username/Password in your
application's frontend. This request should be made server-side and only the
token should be provided to the frontend.**

```javascript
RunnerClient.configure({
  authentication: {
    method: RunnerClient.METHODS.TOKEN // required.
    token: 'abc123' // required delegate token
  },
  environment: RunnerClient.RUNNER_ENVS.PRODUCTION, // optional, defaults to production
});
```

## Web Components

In addition to the Javascript API, this package provides a collection of custom
web components. To load the definitions for these, call `RunnerClient.loadComponents()`
after the WebComponents polyfill and `runnerclient.js` have loaded.

See [index.html](index.html) for an example.

### `<runner-client-configuration>`
```html
<!--
  The <runner-client-configuration> element is required when using other custom
  RunnerClient.js elements. It provides configuration to interact with the
  Runner/Compass API.

  Attributes:
    token: Required. This should be a delegate token provided to you by the Compass API.
    method: Required. The authentication method for API requests. Currently only "token" is supported.
    environment: Optional. The Compass environment to interact with. Should be one of
      "development", "integration", "staging", or "production". Defaults to "production"
    locale: Optional. This is an I18n key for text translations in the custom
      elements. Currently defaults to the only option, "en".
    log-level: Optional. Enables more verbose logging. See RunnerClient.LOG_LEVELS for options
-->

<runner-client-configuration
  token="abc123"
  method="token"
  environment="production"
  locale="en"
  log-level="warn">
</runner-client-configuration>
```

### `<runner-uploader>`
```html
<!--
  The <runner-uploader> element creates an darg-drop area as well as "Add Files"
  and "Upload" buttons; everything needed for a basic upload of files or folders
  to Runner.

  NOTE: This element requires the presence of the asperaweb-4 and
  connectinstaller-4 scripts, as demoed above.

  Attributes:
    destination-folder: The folder ID assets should be uploaded to. If multiple
      are needed, use the `folderIDs` property instead of this attribute.

  Properties:
    files: An array of files to be uploaded.
    folderIDs: An array of Compass Folder IDs that items are to be uploaded to.
      Changing this property will unset the `destination-folder` attribute.

  Events:
    RunnerClient.EVENTS.FILES_ADDED ('spe-files-added'): emitted when files
      dropped on the element or added via the 'Add Files' button.
      Attributes:
        detail.success: Boolean. False indicates too many files were added.
        detail.currentFiles: The current array of files (same as the `files` property above)
        detail.filesAdded: The count of files added during this drop/add operation.
    RunnerClient.EVENTS.FILES_REMOVED ('spe-files-removed'): emitted when files
      are removed from the files list
      Attributes:
        detail.currentFiles: The current array of files (same as the `files` property above)
    RunnerClient.EVENTS.UPLOAD_STARTED ('spe-upload-started'): emitted when
      "upload" button is clicked
      Attributes:
        detail.currentFiles: The current array of files (same as the `files` property above)
    RunnerClient.EVENTS.UPLOAD_FAILED ('spe-upload-failed'): emitted when an
      error occurs during upload
      Attributes:
        detail.currentFiles: The current array of files (same as the `files` property above)
    RunnerClient.EVENTS.UPLOAD_COMPLETE ('spe-upload-complete'): emitted when
      all Aspera transfers have completed.
      Attributes:
        detail.currentFiles: The current array of files (same as the `files` property above)
-->

<runner-uploader destination-folder="42"></runner-uploader>
```

### `<runner-thumbnail-updater>`
```html
<!--
  The <runner-thumbnail-updater> element creates an darg-drop area as well as "Add Files"
  and "Upload" buttons; everything needed for updating the thumbnail image for
  one or more Compass asset items.

  Attributes:
    asset-item-id: The asset item ID that will be updated. If multiple
      are needed, use the `assetItemIDs` property instead of this attribute.

  Properties:
    assetItemIDs: An array of Compass Asset Item IDs that are to be updated.
      Changing this property will unset the `asset-item-id` attribute.

  Events:
    RunnerClient.EVENTS.UPLOAD_FAILED ('spe-upload-failed'): emitted when an
      error occurs during upload
      Attributes:
        detail.assetItemIDs: The current array of assetItemIDs
        detail.filename: The file name of the image uploaded
        detail.error: Error details
    RunnerClient.EVENTS.UPLOAD_COMPLETE ('spe-upload-complete'): emitted when
      all Aspera transfers have completed.
      Attributes:
        detail.assetItemIDs: The current array of assetItemIDs
        detail.filename: The file name of the image uploaded
-->

<runner-thumbnail-updater asset-item-id="42"></runner-thumbnail-updater>
```

### Dependencies

- The Aspera Connect client (3.7.4+) is required for the `<spe-file-drop>`
  component. For more information about the Connect client, see
  [here](https://developer.asperasoft.com/web/connect-client).

- The Custom Elements provided are not natively supported by all browsers, and
  will need the `webcomponentsjs` polyfill to work properly.
  See [here](https://github.com/WebComponents/webcomponentsjs) for instructions.

- In addition to `webcomponentsjs`, an additional polyfill package is provided
  for Internet Explorer & Safari. See example in [index.html](index.html) for usage.

## Development Dependencies

- NodeJS: `>=10.1.0`
- Google Chrome 58+

## Testing

JS Library testing: `npm run test`

## Building

`npm run build` will output new files to the `dist` directory.

## Development

`npm run start` will run the webpack-dev-server and open the example file in
your browser.
