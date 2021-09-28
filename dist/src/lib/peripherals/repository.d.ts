import Peripheral from '../../orm/models/peripheral';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';
export declare class PeripheralsRepository extends BaseRepository<Peripheral> {
    constructor(wrapper: SequelizeWrapper);
    createPeripheral(name: string, type_id: string, config: {}): Promise<string>;
    getPeripherals(): Promise<import("../../orm/models/peripheral").IPeripheral[]>;
    getPeripheral(peripheral_id: string): Promise<import("../../orm/models/peripheral").IPeripheral>;
}
