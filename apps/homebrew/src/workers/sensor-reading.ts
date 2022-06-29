import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TelemetryService } from '../lib/services/telemetry/service';
import { NewSensorReading } from '../models/events/new-sensor-reading';
import { SocketGateway } from '../socket-gateway/gateway';

@Injectable()
export class SensorReadingWorkerService {
  constructor(
    private gateway: SocketGateway,
    private telemetryService: TelemetryService,
  ) {}

  @OnEvent(NewSensorReading.Channel)
  async sendEventToUi(payload: NewSensorReading) {
    this.gateway.sendMessage(NewSensorReading.Channel, payload);
  }

  @OnEvent(NewSensorReading.Channel)
  async saveSensorTelemetry(payload: NewSensorReading) {
    await this.telemetryService.createTelemetry(
      payload.sensor_id,
      payload.reading,
    );
  }
}
