import { AbstractValidator } from 'fluent-ts-validator';
import { Inject, Service } from 'typedi';
import { Sensor } from '../models/sensor';

@Service()
export class SensorValidator extends AbstractValidator<Sensor> {
  constructor(@Inject('sensorTypes') sensorTypes: string[]) {
    super();

    this.validateIfString((x) => x.name)
      .isDefined()
      .withFailureCode('NAME_INVALID');

    this.validateIfString((x) => x.type_id)
      .isIn(sensorTypes)
      .withFailureCode('SENSOR_TYPE_INVALID');
  }
}
