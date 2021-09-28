import Sensor, { ISensor } from './sensor';
import { BaseModel } from '../base-model';
export interface ITelemetry {
    id?: string;
    sensor_id: string;
    reading: number;
    sensor?: ISensor;
}
export default class Telemetry extends BaseModel<ITelemetry> {
    id?: string;
    sensor_id: string;
    reading: number;
    sensor?: Sensor;
}
