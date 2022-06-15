import { Inject, Injectable } from '@nestjs/common';
import { Kettle } from '../../database/models/kettle';
import { KettleRepository } from '../../lib/constants';
import { nullIfEmpty } from '../../lib/utils';
import { KettleDto } from '../../models/dto/kettle.dto';

@Injectable()
export class KettleService {
  constructor(@Inject(KettleRepository) private repository: typeof Kettle) {}

  async createKettle(
    name: string,
    sensor_id?: string,
    heater_id?: string,
    logicType_id?: string,
    config?: any,
  ) {
    const kettle = await this.repository.create({
      name,
      sensor_id: await nullIfEmpty(sensor_id),
      heater_id: await nullIfEmpty(heater_id),
      logicType_id: await nullIfEmpty(logicType_id),
      config: await nullIfEmpty(config),
    });

    return kettle.id;
  }

  async getKettles() {
    const kettles = await this.repository.findAll();

    return kettles.map((kettle) => {
      return new KettleDto(
        kettle.id,
        kettle.name,
        kettle.sensor_id,
        kettle.heater_id,
        kettle.logicType_id,
        JSON.parse(kettle.config || '{}'),
      );
    });
  }

  async updateKettle(id: string, kettle: KettleDto) {
    const currentKettle = await this.repository.findByPk(id);

    if (!kettle) {
      throw new Error('Kettle not found');
    }

    currentKettle.update({
      name: kettle.name,
      sensor_id: await nullIfEmpty(kettle.sensor_id),
      heater_id: await nullIfEmpty(kettle.heater_id),
      logicType_id: await nullIfEmpty(kettle.logicType_id),
      config: await nullIfEmpty(kettle.config),
    });

    await currentKettle.save();
  }
}
