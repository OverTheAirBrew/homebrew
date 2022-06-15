import { Inject, Injectable } from '@nestjs/common';
import { Sensor } from '../../database/models/sensor';
import { SensorRepository } from '../../lib/constants';
import { IdResponseDto } from '../../models/dto/id-response.dto';
import { SensorDto } from '../../models/dto/sensor.dto';

@Injectable()
export class SensorService {
  constructor(@Inject(SensorRepository) private repository: typeof Sensor) {}

  public async createSensor(name: string, type_id?: string, config?: string) {
    const createdSensor = await this.repository.create({
      name,
      type_id,
      config,
    });

    return new IdResponseDto(createdSensor.id);
  }

  public async getSensors() {
    const sensors = await this.repository.findAll();

    return sensors.map((sensor) => {
      return new SensorDto(
        sensor.id,
        sensor.name,
        sensor.type_id,
        sensor.config,
      );
    });
  }

  public async getSensorById(id: string) {
    const sensor = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!sensor) {
      throw new Error('Sensor not found');
    }

    return new SensorDto(sensor.id, sensor.name, sensor.type_id, sensor.config);
  }
}
