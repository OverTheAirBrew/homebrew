import { Inject, Service } from 'typedi';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';
import { ILogger } from './plugin/abstractions/logger';

interface ILoggingOptions {
  serviceName: string;
  node_env: string;
  level: LogLevel;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'verbose';

@Service()
export class Logger implements ILogger {
  private readonly _logger: WinstonLogger;

  constructor(@Inject('loggingOptions') options: ILoggingOptions) {
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

  public warn(message: string, ...meta: any[]): void {
    this._logger.warn(message, ...meta);
  }

  public error(error: Error, ...meta: any[]): void {
    this._logger.error(error.message, { stack: error.stack }, ...meta);
  }
}
