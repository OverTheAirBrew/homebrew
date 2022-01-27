import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { TelemetryService } from '../../../../src/app/lib/telemetry';
import { TelemetryRepository } from '../../../../src/app/lib/telemetry/repository';

describe('lib/telementry', () => {
  let telemetryService: TelemetryService;

  let telemetryRepositoryStub: StubbedInstance<TelemetryRepository>;

  beforeEach(() => {
    telemetryRepositoryStub = stubConstructor(TelemetryRepository);
    telemetryRepositoryStub.saveTelemetryForSensorId.resolves();

    telemetryService = new TelemetryService(telemetryRepositoryStub);
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
      ).to.deep.eq(['1234', 1]);
    });
  });
});
