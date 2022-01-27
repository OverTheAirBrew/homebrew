import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorTypesService } from '../../../src/app/lib/actor-types';
import { Actor } from '../../../src/app/lib/plugin/abstractions/actor';
import { StringProperty } from '../../../src/app/lib/plugin/properties';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';
import { ActorTypeDto } from '../../../src/app/models/dto/actor-dto';

class TestActor extends Actor<any> {
  constructor() {
    super('testing-actor', [new StringProperty('test', true)]);
  }

  protected async processOn() {}
  protected async processOff() {}
}

describe('lib/sensor-types', () => {
  let actorTypesService: ActorTypesService;

  let propertyMapper: StubbedInstance<PropertyMapper>;

  before(() => {
    propertyMapper = stubConstructor(PropertyMapper);
    propertyMapper.map.resolves({} as any);

    actorTypesService = new ActorTypesService(
      [new TestActor()],
      propertyMapper,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getSensorTypes', () => {
    it('should map all the properties', async () => {
      await actorTypesService.getActorTypes();
      expect(propertyMapper.map.callCount).to.eq(1);
    });
  });

  describe('getRawActorTypeById', () => {
    it('should return the raw actor type', async () => {
      const actorType = await actorTypesService.getRawActorTypeById(
        'testing-actor',
      );

      expect(actorType).to.be.instanceOf(TestActor);
    });

    it('should throw an error when the actortype does not exist', async () => {
      try {
        await actorTypesService.getRawActorTypeById('unknown');
        expect.fail('should not reach this point');
      } catch (err) {
        expect(err.message).to.eq('Invalid actor type id');
      }
    });
  });

  describe('getActorTypeById', () => {
    it('should return a mapped actor type', async () => {
      const actorType = await actorTypesService.getActorTypeById(
        'testing-actor',
      );
      expect(actorType).to.be.instanceOf(ActorTypeDto);
    });
  });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await actorTypesService.validateConfig('testing-actor', {
        test: 'valid',
      });

      expect(valid).to.be.true;
    });

    it('should return false when the config is invalid', async () => {
      const valid = await actorTypesService.validateConfig('testing-actor', {
        test: undefined,
      });

      expect(valid).to.be.false;
    });
  });
});
