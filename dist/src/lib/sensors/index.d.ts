import { SensorRepository } from './repository';
import { Sensor } from '../models/sensor';
import { SensorValidator } from './validation';
import { Sensor as SensorType } from '@overtheairbrew/homebrew-plugin';
import { TelemetryRepository } from '../telemetry/repoository';
import { Logger } from '../logger';
export declare class SensorService {
    private sensorRepository;
    private telemetryRepository;
    private validator;
    private sensors;
    private logger;
    constructor(sensorRepository: SensorRepository, telemetryRepository: TelemetryRepository, validator: SensorValidator, sensors: SensorType[], logger: Logger);
    private getSensorImplementation;
    sendDataForConfiguredSensors(): Promise<void>;
    createSensor(sensor: Sensor): Promise<string>;
}
