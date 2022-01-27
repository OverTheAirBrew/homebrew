import {
  InMemoryQueueController,
  Listener,
} from '@overtheairbrew/node-typedi-in-memory-queue';
import { Service } from 'typedi';
import { IMessagingManager } from '../lib/plugin/abstractions/messaging-manager';
import { SensorReading } from '../lib/plugin/messages/events/sensor-reading';
import { SensorReading as SocketSensorReading } from '../lib/plugin/messages/sockets/sensor-reading';
import { TelementryService } from '../lib/telemetry';

@InMemoryQueueController('sensor-reading')
@Service()
export class SensorReadingWorker {
  constructor(
    private messagingManager: IMessagingManager,
    private telemetryService: TelementryService,
  ) {}

  @Listener('sensor-reading-to-ui', SensorReading)
  async processSensorReadingForUi({ sensor_id, value }) {
    await this.messagingManager.sendMessageToFrontEnd(SocketSensorReading)({
      sensor_id,
      value,
    });
  }

  @Listener('sensor-reading-save-telemetry', SensorReading)
  async saveTelementry({ sensor_id, value }) {
    await this.telemetryService.saveTelemetryForSensorId(sensor_id, value);
  }
}
