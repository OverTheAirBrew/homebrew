import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Sensor } from '../../orm/models/sensor';

@Service()
export class SensorRepository {
  constructor(
    @InjectRepository(Sensor) private connection: Repository<Sensor>,
  ) {}

  public async createSensor<T>(
    name: string,
    type_id: string,
    config: T,
  ): Promise<string> {
    const savedSensor = await this.connection.save({
      name,
      type_id,
      config: JSON.stringify(config),
    });

    return savedSensor.id;
  }

  async getAllSensors() {
    const sensors = await this.connection.find({ where: {} });
    return sensors;
  }

  async getSensorById(id: string) {
    const sensor = await this.connection.findOne({ where: { id } });
    return sensor;
  }
}
