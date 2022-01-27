import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { startServer } from '../../src/app/controllers';
import { Actor } from '../../src/app/orm/models/actor';
import { clearDatabase } from './helpers/db';

describe('actor', () => {
  let app: Application;

  before(async () => {
    await clearDatabase();
    app = await startServer(true);
  });

  describe('POST /', () => {
    it('should create a new actor', async () => {
      const { status, body } = await request(app)
        .post('/actors')
        .send({
          name: 'testing-actor',
          type_id: 'gpio',
          config: {
            gpioNumber: 1,
          },
        });

      expect(status).to.eq(201);
      expect(body).to.haveOwnProperty('id');

      const actorRepository = getRepository(Actor);

      const refetchedActors = await actorRepository.find({ where: {} });
      expect(refetchedActors).to.have.lengthOf(1);
    });
  });
});
