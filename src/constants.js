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


export { METHODS, RUNNER_ENVS, TOP_LEVEL_METADATA_FIELDS };
