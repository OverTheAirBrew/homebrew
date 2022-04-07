import { Inject, Injectable } from '@nestjs/common';
import { Sensor } from '../../database/models/sensor';
import { SensorRepository } from '../../lib/constants';
import { IdResponseDto } from '../../models/dto/id-response.dto';

@Injectable()
export class SensorService {
  constructor(@Inject(SensorRepository) private repository: typeof Sensor) {}

  public async createSensor(name: string, type_id?: string, config?: string) {
    const configString = JSON.stringify(config) || undefined;

    const createdSensor = await this.repository.create({
      name,
      type_id,
      config: configString,
    });

    return new IdResponseDto(createdSensor.id);
  }
}
