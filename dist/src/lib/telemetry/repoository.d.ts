import Telemetry from '../../orm/models/telemetry';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';
export declare class TelemetryRepository extends BaseRepository<Telemetry> {
    constructor(wrapper: SequelizeWrapper);
    addTelemetryRecord(sensor_id: string, reading: number): Promise<void>;
}
