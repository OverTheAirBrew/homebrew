import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Kettle } from '../../orm/models/kettle';

@Service()
export class KettleRepository {
  constructor(@InjectRepository() private connection: Repository<Kettle>) {}

  async createKettle(name: string, sensor_id: string) {
    const savedKettle = await this.connection.save({
      name,
      sensor_id,
    });
    return savedKettle.id;
  }
}
