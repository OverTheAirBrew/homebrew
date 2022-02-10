import { Service } from 'typedi';
import { Kettle } from '../../models/controller/kettle';
import { ActorRepository } from '../actor/repository';
import { BaseValidator } from '../base-validator';
import { SensorRepository } from '../sensor/repository';

@Service()
export class CreateKettleValidator extends BaseValidator<Kettle> {
  constructor(
    sensorRepository: SensorRepository,
    actorRepository: ActorRepository,
  ) {
    super();

    this.ruleFor('name').notNull().notEmpty();

    this.ruleFor('sensor_id')
      .mustAsync(async (sensor_id) => {
        try {
          const sensor = await sensorRepository.getSensorById(sensor_id);
          return !!sensor;
        } catch {
          return false;
        }
      })
      .when((kettle) => {
        return !!kettle.sensor_id;
      });

    this.ruleFor('heater_id')
      .mustAsync(async (heater_id) => {
        try {
          const actor = await actorRepository.getActorById(heater_id);
          return !!actor;
        } catch {
          return false;
        }
      })
      .when((kettle) => !!kettle.heater_id);
  }
}
