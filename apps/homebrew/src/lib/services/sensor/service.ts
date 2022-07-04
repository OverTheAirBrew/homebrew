import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device } from '../../../database/models/device';
import { Sensor } from '../../../database/models/sensor';
import { DeviceRepository, SensorRepository } from '../../../lib/constants';
import { SensorDoesNotExistError } from '../../../lib/errors/sensor-does-not-exist-error';
import { SensorDto } from '../../../models/dto/sensor.dto';
import { NewSensorReading } from '../../../models/events/new-sensor-reading';
import { SensorTypesService } from '../sensor-types/service';

@Injectable()
export class SensorService {
  constructor(
    @Inject(SensorRepository) private repository: typeof Sensor,
    @Inject(DeviceRepository) private deviceRepository: typeof Device,
    private sensorTypesService: SensorTypesService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async createSensor(
    name: string,
    device_id: string,
    type_id?: string,
    config?: any,
  ) {
    const createdSensor = await this.repository.create({
      name,
      device_id,
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
        sensor.device_id,
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

    return new SensorDto(
      sensor.id,
      sensor.name,
      sensor.device_id,
      sensor.type_id,
      sensor.config,
    );
  }

  public async processSensorReadings() {
    const sensors = await this.repository.findAll({
      where: {},
      include: [this.deviceRepository],
    });

    for (const sensor of sensors) {
      const sensorType = await this.sensorTypesService.getRawSensorTypeById(
        sensor.device.type_id,
        sensor.type_id,
      );

      const sensorReading = await sensorType.run(sensor.id, sensor.config);

      this.eventEmitter.emit(
        NewSensorReading.Channel,
        new NewSensorReading(sensor.id, sensorReading),
      );
    }
  }
}
