import { Inject, Injectable } from '@nestjs/common';
import { Sensor } from '../../database/models/sensor';
import { SensorRepository } from '../../lib/constants';
import { SensorDoesNotExistError } from '../../lib/errors/sensor-does-not-exist-error copy';
import { SensorDto } from '../../models/dto/sensor.dto';

@Injectable()
export class SensorService {
  constructor(@Inject(SensorRepository) private repository: typeof Sensor) {}

  public async createSensor(name: string, type_id?: string, config?: any) {
    const createdSensor = await this.repository.create({
      name,
      type_id,
      config,
    });

    return createdSensor.id;
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
    const sensor = await this.repository.findByPk(id);

    if (!sensor) {
      throw new SensorDoesNotExistError(id);
    }

    return new SensorDto(sensor.id, sensor.name, sensor.type_id, sensor.config);
  }
}
