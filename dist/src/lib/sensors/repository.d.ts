import Sensor from '../../orm/models/sensor';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';
export declare class SensorRepository extends BaseRepository<Sensor> {
    constructor(wrapper: SequelizeWrapper);
    getSensors(): Promise<import("../../orm/models/sensor").ISensor[]>;
    createSensor(name: string, type_id: string, config: {
        sensorAddress: string;
    }): Promise<string>;
}
