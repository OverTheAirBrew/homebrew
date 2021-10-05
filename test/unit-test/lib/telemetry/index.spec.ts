import { expect } from 'chai';
import { StubbedInstance, stubConstructor } from 'ts-sinon';
import { TelemetryService } from '../../../../src/lib/telemetry';
import { TelemetryRepository } from '../../../../src/lib/telemetry/repository';
import { SequelizeWrapper } from '../../../../src/orm/sequelize-wrapper';

describe('lib/telemetry', () => {
  let telemetryService: TelemetryService;

  let telemetryRepositoryStub: StubbedInstance<TelemetryRepository>;

  beforeEach(() => {
    const sequelizeWrapperStub = stubConstructor(SequelizeWrapper, {
      dialect: 'sqlite',
      storage: '',
    });

    telemetryRepositoryStub = stubConstructor(
      TelemetryRepository,
      sequelizeWrapperStub,
    );

    telemetryService = new TelemetryService(telemetryRepositoryStub);
  });

  it('should save into the database', async () => {
    await telemetryService.saveSensorReading('sensor_id', 1);
    expect(telemetryRepositoryStub.saveTelemetryData.callCount).to.eq(1);
    const [sensor_id, value] =
      telemetryRepositoryStub.saveTelemetryData.firstCall.args;

    expect(sensor_id).to.eq('sensor_id');
    expect(value).to.eq(1);
  });
});
