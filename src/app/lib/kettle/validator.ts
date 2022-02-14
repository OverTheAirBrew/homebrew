import { Service } from 'typedi';
import { Kettle } from '../../models/controller/kettle';
import { ActorRepository } from '../actor/repository';
import { BaseValidator } from '../base-validator';
import { LogicTypesService } from '../logic-types';
import { SensorRepository } from '../sensor/repository';
import { KettleRepository } from './repository';

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

@Service()
export class KettleValidator extends BaseValidator<Kettle> {
  constructor(
    sensorRepository: SensorRepository,
    actorRepository: ActorRepository,
    logicTypeService: LogicTypesService,
  ) {
    super();

    this.ruleFor('name')
      .notNull()
      .notEmpty()
      .when((kettle) => !!kettle.name);

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

    this.ruleFor('logicType_id')
      .mustAsync(async (logicType_id) => {
        return !!(await logicTypeService.getLogicTypeById(logicType_id));
      })
      .when((kettle) => !!kettle.logicType_id);

    this.ruleFor('config')
      .mustAsync(async (config, { logicType_id }) => {
        return await logicTypeService.validateConfig(logicType_id, config);
      })
      .when((kettle) => !!kettle.logicType_id);
  }
}

@Service()
export class UpdateKettleValidator extends BaseValidator<{
  kettle_id: string;
  kettle: Kettle;
}> {
  constructor(
    kettleRepository: KettleRepository,
    kettleValidator: KettleValidator,
  ) {
    super();

    this.ruleFor('kettle_id').mustAsync(async (kettle_id) => {
      return !!(await kettleRepository.getKettleById(kettle_id));
    });

    this.ruleFor('kettle').setAsyncValidator(() => kettleValidator);
  }
}
