import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorRepository } from '../../../../src/app/lib/actor/repository';
import { KettleRepository } from '../../../../src/app/lib/kettle/repository';
import {
  CreateKettleValidator,
  KettleValidator,
  UpdateKettleValidator,
} from '../../../../src/app/lib/kettle/validator';
import { LogicTypesService } from '../../../../src/app/lib/logic-types';
import { SensorRepository } from '../../../../src/app/lib/sensor/repository';
import { mockDatabase } from '../../utils/mock-database';

describe('lib/kettle/validator', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('updateKettleValidator', () => {
    let validator: UpdateKettleValidator;

    let kettleRepositoryStub: StubbedInstance<KettleRepository>;
    let sensorRepositoryStub: StubbedInstance<SensorRepository>;
    let actorRepositoryStub: StubbedInstance<ActorRepository>;

    beforeEach(() => {
      mockDatabase();

      kettleRepositoryStub = stubConstructor(KettleRepository);
      kettleRepositoryStub.getKettleById.withArgs('known_kettle').resolves({
        id: 'known_kettle',
      } as any);

      sensorRepositoryStub = stubConstructor(SensorRepository);
      sensorRepositoryStub.getSensorById.withArgs('known_sensor').resolves({
        id: 'known_sensor',
      } as any);

      actorRepositoryStub = stubConstructor(ActorRepository);
      actorRepositoryStub.getActorById
        .withArgs('known_actor')
        .resolves({
          id: 'known_actor',
        } as any)
        .withArgs('known_actor_invalid_config')
        .resolves({ id: 'known_actor' } as any);

      const logicTypesService = stubConstructor(LogicTypesService);
      logicTypesService.getLogicTypeById
        .withArgs('known_logic_type')
        .resolves({} as any);

      logicTypesService.validateConfig
        .withArgs('known_actor_invalid_config', sinon.match.any)
        .resolves(false)
        .withArgs('known_actor', sinon.match.any)
        .resolves(true);

      const kettleValidator = new KettleValidator(
        sensorRepositoryStub,
        actorRepositoryStub,
        logicTypesService,
      );

      validator = new UpdateKettleValidator(
        kettleRepositoryStub,
        kettleValidator,
      );
    });

    it('should return an error if the kettle does not exist', async () => {
      const response = await validator.validateAsync({
        kettle_id: 'unknown_kettle',
        kettle: {
          name: undefined,
        },
      });

      expect(response).to.have.key('kettle_id');
    });

    it('should return an error if the sensor does not exist', async () => {
      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          sensor_id: 'unknown_sensor',
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.key('sensor_id');
    });

    it('should return an error if the sensor repository throw an error', async () => {
      sensorRepositoryStub.getSensorById.reset();
      sensorRepositoryStub.getSensorById.throws(new Error(''));

      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          sensor_id: 'known_sensor',
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.key('sensor_id');
    });

    it('should return an error if the heater is invalid', async () => {
      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          heater_id: 'unknown_actor',
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.key('heater_id');
    });

    it('should return an error if the actor repository throw an error', async () => {
      actorRepositoryStub.getActorById.reset();
      actorRepositoryStub.getActorById.throws(new Error(''));

      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          heater_id: 'known_actor',
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.key('heater_id');
    });

    it('should return an error if the logicType_id does not exist', async () => {
      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          logicType_id: 'unknown_logicType',
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.property('logicType_id');
    });

    it('should return an error if the config for the logic type is invalid', async () => {
      const response = await validator.validateAsync({
        kettle_id: 'known_kettle',
        kettle: {
          name: undefined,
          logicType_id: 'known_logic_type',
          config: {
            foo: 'bar',
          },
        },
      });

      expect(response).to.have.key('kettle');
      expect(response.kettle).to.have.property('config');
    });
  });

  describe('createKettleValidator', () => {
    let validator: CreateKettleValidator;

    let sensorRepositoryStub: StubbedInstance<SensorRepository>;
    let actorRepositoryStub: StubbedInstance<ActorRepository>;
    let logicTypeService: StubbedInstance<LogicTypesService>;

    beforeEach(() => {
      sensorRepositoryStub = stubConstructor(SensorRepository);
      actorRepositoryStub = stubConstructor(ActorRepository);

      validator = new CreateKettleValidator(
        sensorRepositoryStub,
        actorRepositoryStub,
        logicTypeService,
      );
    });

    it('should return valid if everything is valid', async () => {
      sensorRepositoryStub.getSensorById.resolves({} as any);
      actorRepositoryStub.getActorById.resolves({} as any);

      const errors = await validator.validateAsync({
        name: 'test',
        sensor_id: '1234',
        heater_id: '1234',
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

    it('should error if the heater does not exist', async () => {
      actorRepositoryStub.getActorById.throws(new Error(''));

      const errors = await validator.validateAsync({
        name: 'test',
        heater_id: '1234',
      });

      expect(errors).to.have.key('heater_id');
    });

    it('should not validate the heater id if one is not present', async () => {
      const errors = await validator.validateAsync({
        name: 'test',
      });

      expect(Object.keys(errors).length).to.eq(0);
      expect(actorRepositoryStub.getActorById.callCount).to.eq(0);
    });
  });
});
