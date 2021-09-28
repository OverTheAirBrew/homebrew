import { AbstractValidator } from 'fluent-ts-validator';
import { Sensor } from '../models/sensor';
export declare class SensorValidator extends AbstractValidator<Sensor> {
    constructor(sensorTypes: string[]);
}
