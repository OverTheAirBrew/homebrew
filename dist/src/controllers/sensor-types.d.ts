import { SensorTypeDto } from '../lib/models/sensor-type-dto';
import { SensorTypeService } from '../lib/sensor-types';
export declare class SensorTypesController {
    private service;
    constructor(service: SensorTypeService);
    getSensorTypes(): Promise<SensorTypeDto[]>;
}
