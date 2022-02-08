import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { startServer } from '../../src/app/controllers';
import { Actor } from '../../src/app/orm/models/actor';
import { clearDatabase, IDbRepositories } from './helpers/db';

describe('actor', () => {
  let app: Application;

  let repositories: IDbRepositories;

  beforeEach(async () => {
    repositories = await clearDatabase();
    app = await startServer(true);
  });

  describe('POST /', () => {
    it('should create a new actor', async () => {
      const { status, body } = await request(app)
        .post('/actors')
        .send({
          name: 'testing-actor',
          type_id: 'gpio-actor',
          config: {
            gpioNumber: '1',
          },
        });

      expect(status).to.eq(201);
      expect(body).to.haveOwnProperty('id');

      const actorRepository = getRepository(Actor);

      const refetchedActors = await actorRepository.find({ where: {} });
      expect(refetchedActors).to.have.lengthOf(1);
    });
  });

  describe('GET /', () => {
    it('should return all the actors', async () => {
      const [a1, a2] = await repositories.actor.save([
        {
          name: 'actor1',
          type_id: 'actor1-type',
          config: JSON.stringify({ value: '123' }),
        },
        {
          name: 'actor2',
          type_id: 'actor2-type',
          config: JSON.stringify({ value: '4567' }),
        },
      ]);

      const { status, body } = await request(app).get('/actors').send({});

      expect(status).to.eq(200);

      expect(body).to.deep.eq([
        {
          id: a1.id,
          name: 'actor1',
          type_id: 'actor1-type',
          config: { value: '123' },
        },
        {
          id: a2.id,
          name: 'actor2',
          type_id: 'actor2-type',
          config: { value: '4567' },
        },
      ]);
    });
  });
});
