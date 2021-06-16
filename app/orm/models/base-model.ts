import { Model } from 'sequelize';

export class BaseModel<T extends {} = any> extends Model<T, T> {
  toJSON(): T {
    return super.get({ plain: true });
  }
}
