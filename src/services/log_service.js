/* eslint no-console: "off" */
import { Config } from '../config';

class LogService {
  static info(...args) {
    if (Config.logLevelInt >= 2) {
      console.info(...args);
    }
  }

  static warn(...args) {
    if (Config.logLevelInt >= 1) {
      console.warn(...args);
    }
  }

  static debug(...args) {
    if (Config.logLevelInt >= 3) {
      console.log(...args);
    }
  }
}

export { LogService };
