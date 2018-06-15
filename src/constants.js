const DEFAULT_HTTP_HEADERS = {
  'Accept': 'application/json',
  // 'X-Requested-With': 'RunnerClient'
};

const EVENTS = {
  FILES_ADDED: 'spe-files-added',
};

const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  NONE: 'none'
};

const MAX_THUMBNAIL_SIZE = 20000000;
const MAX_UPLOAD_COUNT = 500;

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

const UNSUPPORTED_FILE_EXTENSIONS = [
  '.exe',
  '.html',
  '.htm',
  '.js',
  '.com',
  '.msi',
  '.php',
  '.py',
  '.rb',
  '.swf',
  '.vbs',
];

const VALID_THUMBNAIL_FILE_EXTENSIONS = [ '.jpg', '.jpeg', '.png' ];

module.exports = {
  DEFAULT_HTTP_HEADERS,
  EVENTS,
  LOG_LEVELS,
  MAX_THUMBNAIL_SIZE,
  MAX_UPLOAD_COUNT,
  METHODS,
  RUNNER_ENVS,
  TOP_LEVEL_METADATA_FIELDS,
  UNSUPPORTED_FILE_EXTENSIONS,
  VALID_THUMBNAIL_FILE_EXTENSIONS
};
