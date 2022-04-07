import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelemetryService } from '../../app/telemetry/service';
import { NewSensorReadingEvent } from '../../lib/events';
import { NewSensorReading } from '../../models/events/new-sensor-reading';

@Injectable()
export class WorkerTelemetryService {
  constructor(private service: TelemetryService) {}

  @OnEvent(NewSensorReadingEvent)
  async onNewSensorReading(event: NewSensorReading) {
    await this.service.createTelemetry(event.sensor_id, event.reading);
  }
}
