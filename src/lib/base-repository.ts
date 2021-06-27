import { Model, Repository } from 'sequelize-typescript';
import { OtaHomebrewApp } from '../application';

const sequelize = OtaHomebrewApp.sequelize;

export abstract class BaseRepository<T extends Model> {
  protected model: Repository<T>;

  constructor(model: new () => T) {
    this.model = sequelize.getRepository(model);
  }
}
