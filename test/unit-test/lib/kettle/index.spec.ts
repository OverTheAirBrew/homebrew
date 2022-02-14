import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorRepository } from '../../../../src/app/lib/actor/repository';
import { KettleService } from '../../../../src/app/lib/kettle';
import { KettleRepository } from '../../../../src/app/lib/kettle/repository';
import {
  CreateKettleValidator,
  UpdateKettleValidator,
} from '../../../../src/app/lib/kettle/validator';
import { SensorRepository } from '../../../../src/app/lib/sensor/repository';

describe('lib/kettle', () => {
  let kettleService: KettleService;

  let createValidatorStub: StubbedInstance<CreateKettleValidator>;
  let kettleRepositoryStub: StubbedInstance<KettleRepository>;

  beforeEach(() => {
    createValidatorStub = stubConstructor(CreateKettleValidator);
    createValidatorStub.validateAsync.resolves({});
    createValidatorStub.isValid.resolves(true);

    const updateKettleStub = stubConstructor(UpdateKettleValidator);

    kettleRepositoryStub = stubConstructor(KettleRepository);
    kettleRepositoryStub.createKettle.resolves('1234');

    const sensorRepositoryStub = stubConstructor(SensorRepository);

    const actorRepositoryStub = stubConstructor(ActorRepository);

    kettleService = new KettleService(
      createValidatorStub,
      updateKettleStub,
      kettleRepositoryStub,
      sensorRepositoryStub,
      actorRepositoryStub,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createKettle', () => {
    it('should save the kettle if it is valid', async () => {
      const { id } = await kettleService.createKettle({
        name: 'test',
        sensor_id: '1234',
        heater_id: '1234',
        logicType_id: '1234',
        config: {},
      });

      expect(id).to.eq('1234');
      expect(kettleRepositoryStub.createKettle.callCount).to.eq(1);
    });

    it('should error if the validation fails', async () => {
      createValidatorStub.isValid.resolves(false);

      try {
        await kettleService.createKettle({
          name: 'test',
          sensor_id: '1234',
          heater_id: '1234',
          logicType_id: '1234',
          config: {},
        });
        expect.fail('should have thrown');
      } catch (err) {
        expect(err.message).to.eq('Invalid kettle config');
      }
    });
  });
});
