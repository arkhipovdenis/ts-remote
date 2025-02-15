import process from 'node:process';

const APP_NAME = process.env['npm_package_name'];

class Logger {
  constructor(private logLevel: Console) {}

  log(message?: unknown, ...optionalParams: unknown[]) {
    this.logLevel.log(`[${APP_NAME}] ${message}`, ...optionalParams);
  }

  error(message?: unknown, ...optionalParams: unknown[]) {
    this.logLevel.error(`[${APP_NAME}] ${message}`, ...optionalParams);
  }
}

export const logger = new Logger(console);
