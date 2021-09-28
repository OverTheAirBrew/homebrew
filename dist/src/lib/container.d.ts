/// <reference types="node" />
import { IPackageConfig } from '@overtheairbrew/homebrew-plugin';
import { Queues } from '@overtheairbrew/node-typedi-in-memory-queue';
import { Server } from 'http';
import { DatabaseOptions } from '../orm/sequelize-wrapper';
export declare class OtaContainer {
    constructor();
    static setupContainer(httpServer: Server, database: DatabaseOptions, queues: Queues, pluginConfig: IPackageConfig): Promise<void>;
}
