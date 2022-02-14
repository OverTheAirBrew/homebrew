import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';
import { clearDatabase, IDbRepositories } from './helpers/db';

describe('kettle', () => {
  let app: Application;
  let repositories: IDbRepositories;

  before(async () => {
    app = await startServer(true);
  });

  beforeEach(async () => {
    repositories = await clearDatabase();
  });

  describe('POST /', () => {
    it('should create a new kettle', async () => {
      const sensor = await repositories.sensor.save({
        name: 'testing-sensor',
        type_id: 'one-wire',
        config: '{}',
      });

      const { status } = await request(app).post('/kettles').send({
        name: 'testing-kettle',
        sensor_id: sensor.id,
      });

      expect(status).to.eq(201);

      const refetchedKettle = await repositories.kettle.find({});
      expect(refetchedKettle).to.have.lengthOf(1);
    });
  });

  describe('PUT /:id', () => {
    it('should update the kettle', async () => {
      const [{ id }] = await repositories.kettle.save([
        {
          name: 'testing-actor',
        },
        {
          name: 'testing-actor-2',
        },
      ]);

      const { status, body } = await request(app).put(`/kettles/${id}`).send({
        name: 'updated-name',
      });

      console.log(body);

      expect(status).to.eq(204);

      const refetchedActor = await repositories.kettle.findOne({
        where: { id },
      });

      expect(refetchedActor).to.not.be.undefined;
      expect(refetchedActor.name).to.eq('updated-name');
    });
  });

  describe('GET /', () => {
    it('should return kettles', async () => {
      const kettle = {
        name: 'testing-kettle',
      };
    });
  });
});
