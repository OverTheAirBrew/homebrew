import { Repository, Sequelize, Model } from 'sequelize-typescript';

export abstract class BaseRepository<T extends Model> {
  protected model: Repository<T>;

  constructor(model: new () => T, sequelize: Sequelize) {
    this.model = sequelize.getRepository(model);
  }
}
