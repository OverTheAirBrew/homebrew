import { ILogger } from '@overtheairbrew/homebrew-plugin';
import { Sequelize } from 'sequelize';
export declare class ProgramaticMigate {
    private connection;
    private readonly umzug;
    constructor(connection: Sequelize, logger: ILogger);
    up(): Promise<string[]>;
    down(): Promise<void>;
}
