import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { v4 as uuid } from 'uuid';
import { Actor } from '../../../database/models/actor';
import { ActorRepository } from '../../constants';
import { ActorDoesNotExistError } from '../../errors/actor-does-not-exist-error';
import { ActorService } from './service';

describe('actor-service', () => {
  let service: ActorService;

  let repository: typeof Actor;
  let returnId: string;

  beforeEach(async () => {
    let findByPkStub = jest.fn();
    when(findByPkStub).calledWith('testingactor').mockReturnValue({
      id: 'id',
      name: 'name',
      type_id: 'type_id',
      config: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    when(findByPkStub).calledWith('invalidactor').mockReturnValue(null);

    returnId = uuid();

    const moduleRef = await Test.createTestingModule({
      providers: [ActorService],
    })
      .useMocker((token) => {
        if (token === ActorRepository) {
          return {
            findAll: jest.fn().mockReturnValue([
              {
                id: 'id',
                name: 'name',
                type_id: 'type_id',
                config: '{}',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]),
            findByPk: findByPkStub,
            create: jest.fn().mockReturnValue({
              id: returnId,
            }),
          };
        }
      })
      .compile();

    service = moduleRef.get(ActorService);
    repository = moduleRef.get(ActorRepository);
  });

  describe('getAllActors', () => {
    it('should return all actors', async () => {
      const actors = await service.getAllActors();
      expect(actors).toEqual([
        {
          config: {},
          name: 'name',
          type_id: 'type_id',
          id: 'id',
        },
      ]);
    });
  });

  describe('getActorById', () => {
    it('should return the actor if one exists', async () => {
      const actor = await service.getActorById('testingactor');
      expect(actor).toEqual({
        config: {},
        name: 'name',
        type_id: 'type_id',
        id: 'id',
      });
    });

    it('should throw an error if the actor does not exist', async () => {
      try {
        await service.getActorById('invalidactor');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(ActorDoesNotExistError);
      }
    });
  });

  describe('createActor', () => {
    it('should save the actor and return the id', async () => {
      const response = await service.createActor('testingname', 'atype', '{}');

      expect(repository.create).toHaveBeenCalled();
      expect(response).toBe(returnId);
    });
  });
});
