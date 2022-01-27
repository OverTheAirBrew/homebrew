import Container from 'typedi';
import { Repository } from 'typeorm';
import { TelementryService } from '../../../src/app/lib/telemetry';
import { clearDatabase } from '../helpers/db';

describe('sensor-reading-worker', () => {
  describe('sensor-reading-to-ui', () => {
    let telemetryService: TelementryService;

    let repositories: Record<string, Repository<any>>;

    beforeEach(async () => {
      ({ repositories } = await clearDatabase());
      telemetryService = Container.get(TelementryService);
    });

    it('should save the data to the database', async () => {
      const sensor = await repositories['sensor'].save({
        name: 'one-wire',
        type_id: 'one-wire',
        config: '{}',
      });

      console.log(sensor);

      await telemetryService.saveTelemetryForSensorId(sensor.id, 1);
    });
  });
});
