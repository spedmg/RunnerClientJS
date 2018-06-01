**FOR SPE INTERNAL USE ONLY**

RunnerClient.js
===============

A JavaScript library for interactions with the Sony Pictures Compass API.

## Module usage

```javascript
import RunnerClient from 'runner-client';
```

## Browser Usage

```html
<script src="runner_client.js"></script>
```

## Client Configuration
```javascript
RunnerClient.configure({
  environment: RunnerClient.RUNNER_ENVS.PRODUCTION, // optional, defaults to production
  authentication: {
    method: RunnerClient.METHODS.TOKEN // required.
  }
});
```

## Development Dependencies

- NodeJS: `>=10.1.0`


## Testing

JS Library testing: `npm run test`
