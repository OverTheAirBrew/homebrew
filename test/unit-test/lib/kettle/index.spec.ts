import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorRepository } from '../../../../src/app/lib/actor/repository';
import { ValidationError } from '../../../../src/app/lib/errors/validation-error';
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
  let updateKettleStub: StubbedInstance<UpdateKettleValidator>;
  let kettleRepositoryStub: StubbedInstance<KettleRepository>;

  beforeEach(() => {
    createValidatorStub = stubConstructor(CreateKettleValidator);
    createValidatorStub.validateAsync.resolves({});
    createValidatorStub.isValid.resolves(true);

    updateKettleStub = stubConstructor(UpdateKettleValidator);

    kettleRepositoryStub = stubConstructor(KettleRepository);
    kettleRepositoryStub.createKettle.resolves('1234');
    kettleRepositoryStub.updateKettle.resolves();

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

  describe('updateKettle', () => {
    it('should save the kettle when the changes are valid', async () => {
      updateKettleStub.validateAsync.resolves({});
      updateKettleStub.isValid.resolves(true);

      const result = await kettleService.updateKettle('1234', {
        name: 'new name',
      });

      expect(result).to.deep.eq({});
    });

    it('should throw an error when the update is invalid', async () => {
      updateKettleStub.isValid.resolves(false);

      try {
        await kettleService.updateKettle('1234', {
          name: 'new name',
        });
      } catch (err) {
        expect(err).to.be.instanceOf(ValidationError);
      }
    });
  });

  describe('getKettles', async () => {
    it('should return a list of mapped kettles', async () => {
      kettleRepositoryStub.getAllKettles.resolves([
        {
          id: 'kettle1',
          name: 'kettle1',
          sensor: {
            id: 'sensor1',
          } as any,
          heater: {
            id: 'heater1',
          } as any,
          logicType_id: 'logic_type1',
          config: JSON.stringify({ value: true }),
        },
      ]);

      const kettles = await kettleService.getKettles();

      expect(kettles).to.deep.eq([
        {
          id: 'kettle1',
          name: 'kettle1',
          sensor_id: 'sensor1',
          heater_id: 'heater1',
          logicType_id: 'logic_type1',
          config: { value: true },
        },
      ]);
    });

    it('should not return heater or sensor ids when there isnt one associated', async () => {
      kettleRepositoryStub.getAllKettles.resolves([
        {
          id: 'kettle1',
          name: 'kettle1',
          sensor: undefined,
          heater: undefined,
          logicType_id: 'logic_type1',
          config: JSON.stringify({ value: true }),
        },
      ]);

      const kettles = await kettleService.getKettles();

      expect(kettles).to.deep.eq([
        {
          id: 'kettle1',
          name: 'kettle1',
          sensor_id: undefined,
          heater_id: undefined,
          logicType_id: 'logic_type1',
          config: { value: true },
        },
      ]);
    });
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
