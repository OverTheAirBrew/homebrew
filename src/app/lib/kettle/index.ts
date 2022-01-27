import { Service } from 'typedi';
import { Kettle } from '../../models/controller/kettle';
import { KettleRepository } from './repository';
import { CreateKettleValidator } from './validator';

@Service()
export class KettleService {
  constructor(
    private createKettleValidator: CreateKettleValidator,
    private kettleRepository: KettleRepository,
  ) {}

  async createKettle(kettle: Kettle) {
    const errors = await this.createKettleValidator.validateAsync(kettle);

    if (await this.createKettleValidator.isValid(errors)) {
      const id = await this.kettleRepository.createKettle(
        kettle.name,
        kettle.sensor_id,
      );

      return { id };
    }

    throw new Error('Invalid kettle config');
  }
}
