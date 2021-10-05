import { expect } from 'chai';
import { SensorService } from '../../../src/lib/sensors';
import { SensorRepository } from '../../../src/lib/sensors/repository';
import { SensorValidator } from '../../../src/lib/sensors/validation';
import { TelemetryRepository } from '../../../src/lib/telemetry/repository';
import Sensor from '../../../src/orm/models/sensor';
import Telemetry from '../../../src/orm/models/telemetry';
import { SequelizeWrapper } from '../../../src/orm/sequelize-wrapper';
import { TestSensor } from '../../testing-plugin';
import { cleanup } from '../utils/cleanup';

describe('hooks/sensor-reading', () => {
  let sensorService: SensorService;

  let sequelizeWrapper: SequelizeWrapper;

  beforeEach(async () => {
    sequelizeWrapper = await cleanup();

    sensorService = new SensorService(
      new SensorRepository(sequelizeWrapper),
      new SensorValidator(['testing-sensor']),
      new TelemetryRepository(sequelizeWrapper),
      [new TestSensor()],
    );

    await sequelizeWrapper.sequelize.getRepository(Sensor).create({
      type_id: 'testing-sensor',
      name: 'Testing Sensor',
      config: {},
    });
  });

  it('should save telemetry data for the given sensors', async () => {
    await sensorService.processSensorReadings();

    const telemetryReadings = await sequelizeWrapper.sequelize
      .getRepository(Telemetry)
      .findAll({
        where: {},
      });

    expect(telemetryReadings).to.have.lengthOf(1);
  });
});
