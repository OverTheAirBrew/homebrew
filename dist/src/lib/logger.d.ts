import { ILogger } from '@overtheairbrew/homebrew-plugin';
interface ILoggingOptions {
    serviceName: string;
    node_env: string;
    level: LogLevel;
}
export declare type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'verbose';
export declare class Logger implements ILogger {
    private readonly _logger;
    constructor(options: ILoggingOptions);
    debug(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    error(error: Error, ...meta: any[]): void;
}
export declare const logger: Logger;
export {};
