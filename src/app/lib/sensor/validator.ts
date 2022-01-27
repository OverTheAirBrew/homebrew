import { Service } from 'typedi';
import { Sensor } from '../../models/controller/sensor';
import { BaseValidator } from '../base-validator';
import { SensorTypesService } from '../sensor-types';

@Service()
export class SensorValidator extends BaseValidator<Sensor> {
  constructor(sensorTypeService: SensorTypesService) {
    super();

    this.ruleFor('name').notNull().notEmpty();

    this.ruleFor('type_id').mustAsync(async (type_id) => {
      const sensorType = await sensorTypeService.getSensorTypeById(type_id);
      return !!sensorType;
    });

    this.ruleFor('config').mustAsync(async (config, { type_id }) => {
      return await sensorTypeService.validateConfig(type_id, config);
    });
  }
}
