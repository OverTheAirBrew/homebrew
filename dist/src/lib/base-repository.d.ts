import { Repository, Sequelize, Model } from 'sequelize-typescript';
export declare abstract class BaseRepository<T extends Model> {
    protected model: Repository<T>;
    constructor(model: new () => T, sequelize: Sequelize);
}
