const METHODS = {
  COOKIE: 'cookie',
  OAUTH: 'oauth',
  TOKEN: 'token'
};

const RUNNER_ENVS = {
  DEVELOPMENT: 'development',
  INTEGRATION: 'integration',
  STAGING:     'staging',
  PRODUCTION:  'production'
};

const TOP_LEVEL_METADATA_FIELDS = [
  'asset_owner',
  'asset_subtype',
  'asset_type',
  'managed_by',
  'naming_convention',
  'usage_classification',
  'usage_status',
];

const DEFAULT_HTTP_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'RunnerClient'
};

export {
  DEFAULT_HTTP_HEADERS,
  METHODS,
  RUNNER_ENVS,
  TOP_LEVEL_METADATA_FIELDS
};
