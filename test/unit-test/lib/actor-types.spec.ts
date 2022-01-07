import { Actor, StringProperty } from '@overtheairbrew/homebrew-plugin';
import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorTypesService } from '../../../src/app/lib/actor-types';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';

class TestActor extends Actor {
  constructor() {
    super('testing-actor', [new StringProperty('test', true)]);
  }

  public async on() {}
  public async off() {}
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
});
