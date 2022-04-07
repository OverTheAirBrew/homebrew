import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewSensorReadingEvent } from '../../lib/events';
import { NewSensorReading } from '../../models/events/new-sensor-reading';
import { SocketGateway } from '../../socket-gateway/gateway';

@Injectable()
export class WorkerSensorReadingsToSocketService {
  constructor(private gateway: SocketGateway) {}

  @OnEvent(NewSensorReadingEvent)
  async sendEventToUi(payload: NewSensorReading) {
    console.log(NewSensorReadingEvent, payload);

    this.gateway.sendMessage(NewSensorReadingEvent, payload);
  }
}
