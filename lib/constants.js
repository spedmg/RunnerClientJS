'use strict';

var DEFAULT_HTTP_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

var EVENTS = {
  FILES_ADDED: 'spe-files-added',
  FILES_REMOVED: 'spe-files-removed',
  REMOVE_FILE: 'spe-remove-file',
  UPLOAD_STARTED: 'spe-upload-started',
  UPLOAD_FAILED: 'spe-upload-failed',
  UPLOAD_COMPLETE: 'spe-upload-complete'
};

var LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  NONE: 'none'
};

var MAX_THUMBNAIL_SIZE = 20000000;
var MAX_UPLOAD_COUNT = 500;

var METHODS = {
  COOKIE: 'cookie',
  OAUTH: 'oauth',
  TOKEN: 'token'
};

var RUNNER_ENVS = {
  DEVELOPMENT: 'development',
  INTEGRATION: 'integration',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

var TOP_LEVEL_METADATA_FIELDS = ['asset_owner', 'asset_subtype', 'asset_type', 'managed_by', 'naming_convention', 'usage_classification', 'usage_status'];

var UNSUPPORTED_FILE_EXTENSIONS = ['.exe', '.html', '.htm', '.js', '.com', '.msi', '.php', '.py', '.rb', '.swf', '.vbs'];

var VALID_THUMBNAIL_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

module.exports = {
  DEFAULT_HTTP_HEADERS: DEFAULT_HTTP_HEADERS,
  EVENTS: EVENTS,
  LOG_LEVELS: LOG_LEVELS,
  MAX_THUMBNAIL_SIZE: MAX_THUMBNAIL_SIZE,
  MAX_UPLOAD_COUNT: MAX_UPLOAD_COUNT,
  METHODS: METHODS,
  RUNNER_ENVS: RUNNER_ENVS,
  TOP_LEVEL_METADATA_FIELDS: TOP_LEVEL_METADATA_FIELDS,
  UNSUPPORTED_FILE_EXTENSIONS: UNSUPPORTED_FILE_EXTENSIONS,
  VALID_THUMBNAIL_FILE_EXTENSIONS: VALID_THUMBNAIL_FILE_EXTENSIONS
};