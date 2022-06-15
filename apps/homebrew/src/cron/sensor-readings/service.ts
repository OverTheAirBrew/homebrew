import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SensorTypesService } from '../../app/sensor-types/service';
import { SensorService } from '../../app/sensor/service';
import { NewSensorReadingEvent } from '../../lib/events';
import { NewSensorReading } from '../../models/events/new-sensor-reading';

@Injectable()
export class SensorReadingsService {
  constructor(
    private service: SensorService,
    private sensorTypes: SensorTypesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async getSensorReadings() {
    const sensors = await this.service.getSensors();

    for (const sensor of sensors) {
      const sensorType = await this.sensorTypes.getRawSensorTypeById(
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
