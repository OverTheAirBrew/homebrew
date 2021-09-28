import { Sensor } from '../lib/models/sensor';
import { SensorService } from '../lib/sensors';
export declare class SensorController {
    private service;
    constructor(service: SensorService);
    createSensor(body: Sensor): Promise<{
        id: string;
    }>;
}
