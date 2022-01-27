import { expect } from 'chai';
import sinon from 'ts-sinon';
import Container from 'typedi';
import { getRepository } from 'typeorm';
import { MessagingManager } from '../../../src/app/lib/messaging-manager';
import { SensorService } from '../../../src/app/lib/sensor';
import { Sensor } from '../../../src/app/orm/models/sensor';
import { clearDatabase } from '../helpers/db';

describe('hooks/sensor-readings', () => {
  let sendEventSpy: sinon.SinonSpy;

  beforeEach(async () => {
    await clearDatabase();
    sendEventSpy = sinon.spy(MessagingManager.prototype, 'sendEvent');
  });

  describe('fetch-latest', () => {
    it('should send an event for each sensor', async () => {
      const sensorRepository = getRepository(Sensor);
      await sensorRepository.save({
        name: 'testing',
        type_id: 'one-wire',
        config: JSON.stringify({
          sensorAddress: '28-000004c8b8d3',
        }),
      });

      const sensorService = Container.get<SensorService>(SensorService);

      await sensorService.processLatestSensorReadings();

      expect(sendEventSpy.callCount).to.eq(1);
    });
  });
});
