import { Sensor as SensorType } from '@overtheairbrew/homebrew-plugin';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { SensorTypeDto } from '../models/sensor-type-dto';
export declare class SensorTypeService {
    private sensors;
    propMapper: PropertyTypeMapper;
    constructor(sensors: SensorType[], propMapper: PropertyTypeMapper);
    getSensorTypeIds(): Promise<string[]>;
    getSensorTypes(): Promise<SensorTypeDto[]>;
}
