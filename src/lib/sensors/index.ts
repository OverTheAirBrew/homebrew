import { InjectMany, Service } from 'typedi';
import { SensorRepository } from './repository';
import { Sensor } from '../models/sensor';

import { SensorValidator } from './validation';
import { ValidationError } from '../errors/validation-error';
import {
  SensorToken,
  Sensor as SensorType,
} from '@overtheairbrew/homebrew-plugin';
import { ValidationFailure, ValidationResult } from 'fluent-ts-validator';
import { SensorImplementationNotFoundError } from '../errors/sensor-implementation-not-found';
import { TelemetryRepository } from '../telemetry/repoository';
import { Logger } from '../logger';

@Service()
export class SensorService {
  constructor(
    private sensorRepository: SensorRepository,
    private telemetryRepository: TelemetryRepository,
    private validator: SensorValidator,
    @InjectMany(SensorToken) private sensors: SensorType[],
    private logger: Logger,
  ) {}

  private async getSensorImplementation(
    type_id: string,
    shouldThrow: boolean = true,
  ): Promise<SensorType> {
    const implementation = this.sensors.find((si) => si.sensorType === type_id);

    if (!implementation) {
      if (shouldThrow) {
        throw new SensorImplementationNotFoundError(type_id);
      }

      this.logger.error(new SensorImplementationNotFoundError(type_id));
      return null;
    }

    return implementation;
  }

  public async sendDataForConfiguredSensors() {
    const sensors = await this.sensorRepository.getSensors();

    for (const sensor of sensors) {
      const sensorImplementation = await this.getSensorImplementation(
        sensor.type_id,
        false,
      );

      if (!sensorImplementation) {
        continue;
      }

      const value = await sensorImplementation.run({
        sensor_id: sensor.id,
        ...sensor.config,
      });
      if (!value) return;
      await this.telemetryRepository.addTelemetryRecord(sensor.id, value);
    }
  }

  public async createSensor(sensor: Sensor) {
    const sensorImplementation = await this.getSensorImplementation(
      sensor.type_id,
    );

    const validationResult = await this.validator.validateAsync(sensor);
    const configValid = await sensorImplementation.validate(sensor.config);

    if (validationResult.isValid() && configValid) {
      const id = await this.sensorRepository.createSensor(
        sensor.name,
        sensor.type_id,
        { sensorAddress: sensor.config.busAddress },
      );

      return id;
    }

    const newValidationResult = new ValidationResult();
    newValidationResult.addFailures(validationResult.getFailures());

    if (!configValid) {
      newValidationResult.addFailures([
        new ValidationFailure(
          '',
          'config',
          sensor.config,
          'SENSOR_CONFIG_INVALID',
        ),
      ]);
    }

    throw new ValidationError(newValidationResult);
  }
}
