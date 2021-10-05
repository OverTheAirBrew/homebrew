import {
  Sensor as SensorType,
  SensorToken,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { createValidationErrorWithConfigError } from '../errors/create-validation-error-with-config-error';
import { Sensor } from '../models/sensor';
import { SensorRepository } from './repository';
import { SensorValidator } from './validation';

@Service()
export class SensorService {
  constructor(
    private sensorRepository: SensorRepository,
    private validator: SensorValidator,
    @InjectMany(SensorToken) private sensors: SensorType[],
  ) {}

  private async getSensorImplementation(type_id: string): Promise<SensorType> {
    const implementation = this.sensors.find((si) => si.sensorType === type_id);
    return implementation;
  }

  public async createSensor(sensor: Sensor) {
    const validationResult = await this.validator.validateAsync(sensor);

    const sensorImplementation = await this.getSensorImplementation(
      sensor.type_id,
    );

    const configValid = await sensorImplementation.validate(sensor.config);

    if (validationResult.isValid() && configValid) {
      const id = await this.sensorRepository.createSensor(
        sensor.name,
        sensor.type_id,
        { sensorAddress: sensor.config.busAddress },
      );

      return id;
    }

    const error = await createValidationErrorWithConfigError(
      validationResult.getFailures(),
      configValid,
      sensor.config,
    );

    throw error;
  }
}
