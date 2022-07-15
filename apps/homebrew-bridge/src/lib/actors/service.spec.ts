import { Test } from '@nestjs/testing';
import { TestingActor } from '../../../test/utils/test-providers/actor';
import { IActors } from '../constants';
import { ActorService } from './service';

describe('lib/actors/service', () => {
  let service: ActorService;

  let onStub: jest.Mock;
  let offStub: jest.Mock;

  beforeEach(async () => {
    onStub = jest.fn();
    offStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ActorService,
        {
          provide: IActors,
          useFactory: () => {
            return [
              new TestingActor(
                async () => {
                  return false;
                },
                onStub,
                offStub,
              ),
            ];
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ActorService);
  });

  describe('enableActor', () => {
    it('should turn on the actor if it is valid', async () => {
      await service.enableActor('testing-actor', {});

      expect(onStub.mock.calls.length).toBe(1);
    });

    it('should error if the actor is invalid', async () => {
      try {
        await service.enableActor('unknown-actor', {});
        fail('should not reach this point');
      } catch (err) {
        expect(err.message).toEqual('Actor unknown-actor not found');
      }
    });
  });

  describe('disableActor', () => {
    it('should turn off the actor if it is valid', async () => {
      await service.disableActor('testing-actor', {});
      expect(offStub.mock.calls.length).toBe(1);
    });

    it('should error if the actor is invalid', async () => {
      try {
        await service.disableActor('unknown-actor', {});
        fail('should not reach this point');
      } catch (err) {
        expect(err.message).toEqual('Actor unknown-actor not found');
      }
    });
  });
});
