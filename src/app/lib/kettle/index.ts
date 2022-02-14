import { Service } from 'typedi';
import { Kettle as ControllerKettle } from '../../models/controller/kettle';
import { Kettle } from '../../orm/models/kettle';
import { ActorRepository } from '../actor/repository';
import { ValidationError } from '../errors/validation-error';
import { SensorRepository } from '../sensor/repository';
import { KettleRepository } from './repository';
import { CreateKettleValidator, UpdateKettleValidator } from './validator';

@Service()
export class KettleService {
  constructor(
    private createKettleValidator: CreateKettleValidator,
    private updateKettleValidator: UpdateKettleValidator,
    private kettleRepository: KettleRepository,
    private sensorRepository: SensorRepository,
    private actorRepository: ActorRepository,
  ) {}

  async createKettle(kettle: {
    name: string;
    sensor_id?: string;
    heater_id?: string;
    logicType_id?: string;
    config?: any;
  }) {
    const errors = await this.createKettleValidator.validateAsync(kettle);

    if (await this.createKettleValidator.isValid(errors)) {
      const [sensor, heater] = await Promise.all([
        this.sensorRepository.getSensorById(kettle.sensor_id),
        this.actorRepository.getActorById(kettle.heater_id),
      ]);

      const id = await this.kettleRepository.createKettle(
        kettle.name,
        sensor,
        heater,
        kettle.logicType_id,
        JSON.stringify(kettle.config),
      );

      return { id };
    }

    throw new Error('Invalid kettle config');
  }

  async getKettles() {
    const kettles = await this.kettleRepository.getAllKettles();
    return await Promise.all(kettles.map((kettle) => this.mapKettle(kettle)));
  }

  async updateKettle(kettle_id: string, kettle: ControllerKettle) {
    const errors = await this.updateKettleValidator.validateAsync({
      kettle_id,
      kettle,
    });

    if (await this.updateKettleValidator.isValid(errors)) {
      const [sensor, heater] = await Promise.all([
        this.sensorRepository.getSensorById(kettle.sensor_id),
        this.actorRepository.getActorById(kettle.heater_id),
      ]);

      await this.kettleRepository.updateKettle({
        id: kettle_id,
        sensor,
        heater,
        name: kettle.name,
        logicType_id: kettle.logicType_id,
        config: JSON.stringify(kettle.config),
      });

      return {};
    }

    throw new ValidationError(errors);
  }

  async mapKettle(kettle: Kettle) {
    return {
      id: kettle.id,
      name: kettle.name,
      sensor_id: kettle.sensor?.id,
      heater_id: kettle.heater?.id,
      logicType_id: kettle.logicType_id,
      config: JSON.parse(kettle.config),
    };
  }
}
