import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { ActorService } from '../../../../src/app/lib/actor';
import { ActorRepository } from '../../../../src/app/lib/actor/repository';
import { ActorValidator } from '../../../../src/app/lib/actor/validator';
import { mockDatabase } from '../../utils/mock-database';

describe('lib/actor', () => {
  let actorService: ActorService;

  let validator: StubbedInstance<ActorValidator>;
  let actorRepository: StubbedInstance<ActorRepository>;

  beforeEach(() => {
    mockDatabase();

    validator = stubConstructor(ActorValidator);

    actorRepository = stubConstructor(ActorRepository);
    actorRepository.saveActor.resolves('1234');

    actorService = new ActorService(validator, actorRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createNewActor', () => {
    it('should save the actor when the data is valid', async () => {
      validator.validateAsync.resolves({});
      validator.isValid.resolves(true);

      const { id } = await actorService.createNewActor({
        name: 'test',
        config: {},
        type_id: '1234',
      });

      expect(id).to.eq('1234');
      expect(actorRepository.saveActor.callCount).to.eq(1);
    });

    it('should error if validation fails', async () => {
      validator.validateAsync.resolves({});
      validator.isValid.resolves(false);

      try {
        await actorService.createNewActor({
          name: 'test',
          config: {},
          type_id: '1234',
        });
        expect.fail('should not reach this point');
      } catch (err) {
        expect(err.message).to.eq('Invalid actor');
      }
    });
  });
});