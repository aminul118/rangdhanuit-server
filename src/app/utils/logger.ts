/* eslint-disable no-console */
import envVars from '../config/env';

/**
 * A simple logger utility that only logs to the console in development mode.
 * In production mode, all log methods become no-ops.
 */
const logger = {
  /**
   * Logs general information.
   */
  log: (...args: unknown[]) => {
    if (envVars.NODE_ENV === 'development') {
      console.log(...args);
    }
  },

  /**
   * Logs error messages.
   */
  error: (...args: unknown[]) => {
    if (envVars.NODE_ENV === 'development') {
      console.error(...args);
    }
  },

  /**
   * Logs warning messages.
   */
  warn: (...args: unknown[]) => {
    if (envVars.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },

  /**
   * Logs informational messages.
   */
  info: (...args: unknown[]) => {
    if (envVars.NODE_ENV === 'development') {
      console.info(...args);
    }
  },

};

export default logger;
