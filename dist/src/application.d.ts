/// <reference types="node" />
import * as express from 'express';
import 'reflect-metadata';
import 'source-map-support/register';
import { EventEmitter } from 'stream';
import { DatabaseOptions } from './orm/sequelize-wrapper';
interface IOptions {
    port: number;
    database: DatabaseOptions;
    pluginPatterns?: string[] | [
        'node_modules/@overtheairbrew/homebrew-plugin-**',
        'node_modules/ota-homebrew-plugin-**'
    ];
    cwd?: string;
}
export declare class OtaHomebrewApp extends EventEmitter {
    private options;
    protected disableMigrations: boolean;
    isListening: boolean;
    private paths;
    protected readonly expressApp: express.Express;
    private routingControllersOptions;
    private pluginConfiguration;
    constructor(options: IOptions);
    private loadPlugins;
    private setupContainer;
    private createDocs;
    private runMigrations;
    private loadAllServerControllers;
}
export {};
