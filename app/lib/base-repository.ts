import { Model } from 'sequelize-typescript';
import { sequelize } from '../orm/connection';

export abstract class BaseRepository<T extends Model> {
  protected model: any;

  constructor(model: new () => T) {
    this.model = sequelize.getRepository(model);
  }
}
