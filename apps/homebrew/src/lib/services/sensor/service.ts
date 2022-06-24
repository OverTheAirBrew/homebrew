import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Sensor } from '../../../database/models/sensor';
import { SensorRepository } from '../../../lib/constants';
import { SensorDoesNotExistError } from '../../../lib/errors/sensor-does-not-exist-error';
import { SensorDto } from '../../../models/dto/sensor.dto';
import { NewSensorReading } from '../../../models/events/new-sensor-reading';
import { NewSensorReadingEvent } from '../../events';
import { SensorTypesService } from '../sensor-types/service';

@Injectable()
export class SensorService {
  constructor(
    @Inject(SensorRepository) private repository: typeof Sensor,
    private sensorTypesService: SensorTypesService,
    private eventEmitter: EventEmitter2,
  ) {}

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

  public async processSensorReadings() {
    const sensors = await this.repository.findAll();

    for (const sensor of sensors) {
      const sensorType = await this.sensorTypesService.getRawSensorTypeById(
        sensor.type_id,
      );

      const sensorReading = await sensorType.run(sensor.id, sensor.config);

      this.eventEmitter.emit(
        NewSensorReadingEvent,
        new NewSensorReading(sensor.id, sensorReading),
      );
    }
  }
}
