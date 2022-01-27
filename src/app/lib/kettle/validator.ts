import { Service } from 'typedi';
import { Kettle } from '../../models/controller/kettle';
import { BaseValidator } from '../base-validator';
import { SensorRepository } from '../sensor/repository';

@Service()
export class CreateKettleValidator extends BaseValidator<Kettle> {
  constructor(sensorRepository: SensorRepository) {
    super();

    this.ruleFor('name').notNull().notEmpty();

    this.ruleFor('sensor_id')
      .mustAsync(async (sensor_id) => {
        try {
          await sensorRepository.getSensorById(sensor_id);
          return true;
        } catch {
          return false;
        }
      })
      .when((kettle) => {
        return !!kettle.sensor_id;
      });
  }
}
