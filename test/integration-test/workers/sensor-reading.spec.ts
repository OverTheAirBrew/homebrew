import Container from 'typedi';
import { TelemetryService } from '../../../src/app/lib/telemetry';
import { clearDatabase, IDbRepositories } from '../helpers/db';

describe('sensor-reading-worker', () => {
  describe('sensor-reading-to-ui', () => {
    let telemetryService: TelemetryService;

    let repositories: IDbRepositories;

    beforeEach(async () => {
      repositories = await clearDatabase();
      telemetryService = Container.get(TelemetryService);
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
