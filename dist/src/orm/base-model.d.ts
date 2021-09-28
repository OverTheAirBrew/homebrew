import { Model } from 'sequelize-typescript';
export declare class BaseModel<T extends {} = any> extends Model<T, T> {
    toJSON(): T;
}
