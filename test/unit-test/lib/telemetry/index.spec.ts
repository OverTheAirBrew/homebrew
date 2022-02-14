import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { SensorRepository } from '../../../../src/app/lib/sensor/repository';
import { TelemetryService } from '../../../../src/app/lib/telemetry';
import { TelemetryRepository } from '../../../../src/app/lib/telemetry/repository';

describe('lib/telementry', () => {
  let telemetryService: TelemetryService;

  let telemetryRepositoryStub: StubbedInstance<TelemetryRepository>;

  beforeEach(() => {
    telemetryRepositoryStub = stubConstructor(TelemetryRepository);
    telemetryRepositoryStub.saveTelemetryForSensorId.resolves();

    const sensorRepositoryStub = stubConstructor(SensorRepository);
    sensorRepositoryStub.getSensorById.withArgs('1234').resolves({
      id: '1234',
    } as any);

    telemetryService = new TelemetryService(
      telemetryRepositoryStub,
      sensorRepositoryStub,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('saveTelemetryForSensorId', () => {
    it('should not save if there is no value', async () => {
      await telemetryService.saveTelemetryForSensorId('1234', undefined);
      expect(telemetryRepositoryStub.saveTelemetryForSensorId.callCount).to.eq(
        0,
      );
    });

    it('should save when there is a value', async () => {
      await telemetryService.saveTelemetryForSensorId('1234', 1);

      expect(telemetryRepositoryStub.saveTelemetryForSensorId.callCount).to.eq(
        1,
      );
      expect(
        telemetryRepositoryStub.saveTelemetryForSensorId.firstCall.args,
      ).to.deep.eq([{ id: '1234' }, 1]);
    });
  });
});
