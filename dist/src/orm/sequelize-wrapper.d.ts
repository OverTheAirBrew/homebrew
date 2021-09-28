import { Sequelize } from 'sequelize-typescript';
interface SqlLiteDatabaseOptions {
    dialect: 'sqlite';
    storage: string;
}
interface MysqlDatabaseOptions {
    dialect: 'mysql';
    url: string;
}
export declare type DatabaseOptions = {
    cwd?: string;
} & (SqlLiteDatabaseOptions | MysqlDatabaseOptions);
export declare class SequelizeWrapper {
    private _internalSequelize;
    constructor(options: DatabaseOptions);
    get sequelize(): Sequelize;
    private getConfigFromOptions;
    private getSqlLiteOptions;
    private getMysqlOptions;
}
export {};
