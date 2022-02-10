import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Actor } from '../../orm/models/actor';
import { Kettle } from '../../orm/models/kettle';
import { Sensor } from '../../orm/models/sensor';

@Service()
export class KettleRepository {
  constructor(
    @InjectRepository(Kettle) private connection: Repository<Kettle>,
  ) {}

  async createKettle(
    name: string,
    sensor: Sensor,
    heater: Actor,
    logicType_id: string,
    config: string,
  ) {
    const savedKettle = await this.connection.save({
      name,
      sensor,
      heater,
      logicType_id,
      config,
    });
    return savedKettle.id;
  }

  async getAllKettles() {
    const query = this.connection
      .createQueryBuilder('kettle')
      .innerJoinAndSelect('kettle.sensor', 'sensor')
      .innerJoinAndSelect('kettle.heater', 'heater');

    const kettles = await query.getMany();
    return kettles;
  }
}
