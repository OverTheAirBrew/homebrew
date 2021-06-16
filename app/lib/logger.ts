import {
  Logger as WinstonLogger,
  createLogger,
  format,
  transports,
  level,
} from 'winston';

interface ILoggingOptions {
  serviceName: string;
  node_env: string;
  level: LogLevel;
}

type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'verbose';

class Logger {
  private readonly _options: ILoggingOptions;
  private readonly _logger: WinstonLogger;

  constructor(options: ILoggingOptions) {
    this._options = options;

    this._logger = createLogger({
      level: options.level,
      format: format.json(),
      defaultMeta: {
        service: options.serviceName,
        environment: options.node_env,
      },
      transports: [
        new transports.Console({
          level: options.level,
        }),
      ],
    });
  }

  public debug(message: string, ...meta: any[]): void {
    this._logger.debug(message, ...meta);
  }

  public info(message: string, ...meta: any[]): void {
    this._logger.info(message, ...meta);
  }

  public warning(message: string, ...meta: any[]): void {
    this._logger.warn(message, ...meta);
  }

  public error(error: Error, ...meta: any[]): void {
    this._logger.error(
      error.message,
      Object.assign({ stack: error.stack }, ...meta),
    );
  }
}

const LOG_LEVEL = (process.env.LOGGING_LEVEL as LogLevel) || 'error';

export const logger = new Logger({
  serviceName: 'api',
  node_env: process.env.NODE_ENV,
  level: LOG_LEVEL,
});
