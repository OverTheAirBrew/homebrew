import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelemetryService } from '../../app/telemetry/service';
import { NewSensorReadingEvent } from '../../lib/events';
import { NewSensorReading } from '../../models/events/new-sensor-reading';
import { SocketGateway } from '../../socket-gateway/gateway';

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
