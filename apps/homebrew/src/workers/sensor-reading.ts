import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewSensorReadingEvent } from '../lib/events';
import { TelemetryService } from '../lib/services/telemetry/service';
import { NewSensorReading } from '../models/events/new-sensor-reading';
import { SocketGateway } from '../socket-gateway/gateway';

@Injectable()
export class SensorReadingWorkerService {
  constructor(
    private gateway: SocketGateway,
    private telemetryService: TelemetryService,
  ) {}

  @OnEvent(NewSensorReadingEvent)
  async sendEventToUi(payload: NewSensorReading) {
    this.gateway.sendMessage(NewSensorReadingEvent, payload);
  }

  @OnEvent(NewSensorReadingEvent)
  async saveSensorTelemetry(payload: NewSensorReading) {
    await this.telemetryService.createTelemetry(
      payload.sensor_id,
      payload.reading,
    );
  }
}
