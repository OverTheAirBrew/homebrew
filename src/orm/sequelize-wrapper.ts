import { Service, Container } from 'typedi';
import { Sequelize } from 'sequelize-typescript';
import { BASE_CONFIG } from './config';
import { join } from 'path';

@Service()
export class SequelizeWrapper {
  private _internalSequelize: Sequelize;

  constructor() {
    const databasePath: string = Container.get('databasePath');

    this._internalSequelize = new Sequelize({
      ...BASE_CONFIG,
      storage: databasePath,
      models: [join(__dirname, 'models', '*.js')],
    });
  }

  get sequelize() {
    return this._internalSequelize;
  }
}
