**FOR SPE INTERNAL USE ONLY**

RunnerClient.js
===============

A JavaScript library for interactions with the Sony Pictures Compass API.

## Module usage

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

<script src="runner_client.js"></script>
```

### Dependencies

The Aspera Connect client (3.7.4+) is required for the `<spe-runner-uploader>`
component. For more information about the Connect client, see
[here](https://developer.asperasoft.com/web/connect-client).

## Development Dependencies

- NodeJS: `>=10.1.0`
- Google Chrome 58+

## Testing

JS Library testing: `npm run test`
