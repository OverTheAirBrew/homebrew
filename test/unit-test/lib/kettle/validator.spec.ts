import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorRepository } from '../../../../src/app/lib/actor/repository';
import { CreateKettleValidator } from '../../../../src/app/lib/kettle/validator';
import { SensorRepository } from '../../../../src/app/lib/sensor/repository';

describe('lib/kettle/validator', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createKettleValidator', () => {
    let validator: CreateKettleValidator;

    let sensorRepositoryStub: StubbedInstance<SensorRepository>;

    beforeEach(() => {
      sensorRepositoryStub = stubConstructor(SensorRepository);
      const actorRepositoryStub = stubConstructor(ActorRepository);

      validator = new CreateKettleValidator(
        sensorRepositoryStub,
        actorRepositoryStub,
      );
    });

    it('should return valid if everything is valid', async () => {
      sensorRepositoryStub.getSensorById.resolves({} as any);

      const errors = await validator.validateAsync({
        name: 'test',
        sensor_id: '1234',
      });

      expect(Object.keys(errors).length).to.eq(0);
    });

    it('should error if the name is missing', async () => {
      sensorRepositoryStub.getSensorById.resolves({} as any);

      const errors = await validator.validateAsync({
        name: undefined,
        sensor_id: '1234',
      });

      expect(errors).to.have.key('name');
    });

    it('should error if the sensor does not exist', async () => {
      sensorRepositoryStub.getSensorById.throws(new Error(''));

      const errors = await validator.validateAsync({
        name: 'test',
        sensor_id: '1234',
      });

      expect(errors).to.have.key('sensor_id');
    });

    it('should not validate the sensor id if one is not present', async () => {
      const errors = await validator.validateAsync({
        name: 'test',
      });

      expect(Object.keys(errors).length).to.eq(0);
      expect(sensorRepositoryStub.getSensorById.callCount).to.eq(0);
    });
  });
});
