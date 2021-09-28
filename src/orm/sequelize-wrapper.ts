import { join } from 'path';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Inject, Service } from 'typedi';
import { URL } from 'url';
import { BASE_CONFIG } from './config';

interface SqlLiteDatabaseOptions {
  dialect: 'sqlite';
  storage: string;
}

interface MysqlDatabaseOptions {
  dialect: 'mysql';
  url: string;
}

export type DatabaseOptions = SqlLiteDatabaseOptions | MysqlDatabaseOptions;

@Service()
export class SequelizeWrapper {
  private _internalSequelize: Sequelize;

  constructor(@Inject('databaseOptions') options: DatabaseOptions) {
    const config = this.getConfigFromOptions(options);

    this._internalSequelize = new Sequelize({
      ...config,
      models: [join(__dirname, 'models', '*.js')],
    });
  }

  get sequelize() {
    return this._internalSequelize;
  }

  private getConfigFromOptions(options: DatabaseOptions) {
    if (options.dialect === 'mysql') {
      return this.getMysqlOptions(options);
    }

    if (options.dialect === 'sqlite') {
      return this.getSqlLiteOptions(options);
    }
  }

  private getSqlLiteOptions(
    options: SqlLiteDatabaseOptions,
  ): Partial<SqlLiteDatabaseOptions> {
    if (!require.resolve('sqlite3')) {
      throw new Error('Please install sqlite3 package to use sqllite storage');
    }

    return {
      ...BASE_CONFIG,
      dialect: 'sqlite',
      storage: options.storage,
    };
  }

  private getMysqlOptions(
    options: MysqlDatabaseOptions,
  ): Partial<SequelizeOptions> {
    if (!require.resolve('mysql2')) {
      throw new Error('Please install the mysql2 package to use mysql storage');
    }

    const {
      hostname: host,
      port,
      username,
      password,
      pathname,
    } = new URL(options.url);

    return {
      ...BASE_CONFIG,
      dialect: 'mysql',
      host,
      port: parseInt(port),
      database: pathname.substring(1, pathname.length),
      username,
      password,
    };
  }
}
