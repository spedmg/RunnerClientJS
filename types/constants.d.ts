export const DEFAULT_HTTP_HEADERS: {
    Accept: string;
    'Content-Type': string;
};
export namespace EVENTS {
    const FILES_ADDED: string;
    const FILES_REMOVED: string;
    const REMOVE_FILE: string;
    const UPLOAD_STARTED: string;
    const UPLOAD_FAILED: string;
    const UPLOAD_COMPLETE: string;
}
export namespace LOG_LEVELS {
    const DEBUG: string;
    const INFO: string;
    const WARN: string;
    const NONE: string;
}
export const MAX_THUMBNAIL_SIZE: 20000000;
export const MAX_UPLOAD_COUNT: 500;
export namespace METHODS {
    const COOKIE: string;
    const OAUTH: string;
    const TOKEN: string;
}
export namespace RUNNER_ENVS {
    const DEVELOPMENT: string;
    const INTEGRATION: string;
    const STAGING: string;
    const PRODUCTION: string;
}
export const TOP_LEVEL_METADATA_FIELDS: string[];
export const UNSUPPORTED_FILE_EXTENSIONS: string[];
export const VALID_THUMBNAIL_FILE_EXTENSIONS: string[];
