**FOR SPE INTERNAL USE ONLY**

RunnerClient.js
===============

A JavaScript library for interactions with the Sony Pictures Compass API.

## Module usage

Modules can be accessed directly from the package source. The main entrypoint is
`runnerclient`, with submodules in the `src` directory.

```javascript
import RunnerClient from 'runnerclient';

RunnerClient.configure({
  environment: RunnerClient.RUNNER_ENVS.PRODUCTION, // optional, defaults to production
  authentication: {
    method: RunnerClient.METHODS.TOKEN // required.
    token: 'abc123' // required delegate token
  }
});
```

## Browser Usage

```html
<!-- Aspera AW4 required for using <spe-runner-uploader> -->
<script src="//d3gcli72yxqn2z.cloudfront.net/connect/v4/connectinstaller-4.min.js"></script>
<script src="//d3gcli72yxqn2z.cloudfront.net/connect/v4/asperaweb-4.min.js"></script>

<script src="runner_client.api.js"></script>
```

## Configuration
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

In addition to the Javascript API, this package provides `runner_client.components.js`.
This provides the following v1 Custom Elements:

```html
<!--
  The <runner-client-configuration> element is required when using other custom
  RunnerClient.js elements. It provides configuration to interact with the
  Runner/Compass API.

  Options:
    token: This should be a delegate token provided to you by the Compass API.
    method: The authentication method for API requests. Currently only "token" is supported.
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

### Dependencies

The Aspera Connect client (3.7.4+) is required for the `<spe-file-drop>`
component. For more information about the Connect client, see
[here](https://developer.asperasoft.com/web/connect-client).

## Development Dependencies

- NodeJS: `>=10.1.0`
- Google Chrome 58+

## Testing

JS Library testing: `npm run test`
