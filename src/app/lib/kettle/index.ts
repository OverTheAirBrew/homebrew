import { Service } from 'typedi';
import { Kettle } from '../../orm/models/kettle';
import { ActorRepository } from '../actor/repository';
import { SensorRepository } from '../sensor/repository';
import { KettleRepository } from './repository';
import { CreateKettleValidator } from './validator';

@Service()
export class KettleService {
  constructor(
    private createKettleValidator: CreateKettleValidator,
    private kettleRepository: KettleRepository,
    private sensorRepository: SensorRepository,
    private actorRepository: ActorRepository,
  ) {}

  async createKettle(kettle: {
    name: string;
    sensor_id?: string;
    heater_id?: string;
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
        'testing',
        '{}',
      );

      return { id };
    }

    throw new Error('Invalid kettle config');
  }

  async getKettles() {
    const kettles = await this.kettleRepository.getAllKettles();
    return await Promise.all(kettles.map((kettle) => this.mapKettle(kettle)));
  }

  async mapKettle(kettle: Kettle) {
    return {
      id: kettle.id,
      name: kettle.name,
      sensor_id: kettle.sensor?.id,
      heater_id: kettle.heater?.id,
    };
  }
}
