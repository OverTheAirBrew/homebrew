import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { startServer } from '../../src/app/controllers';
import { Sensor } from '../../src/app/orm/models/sensor';
import { clearDatabase } from './helpers/db';

describe('sensor', () => {
  let app: Application;

  before(async () => {
    app = await startServer(true);
    await clearDatabase();
  });

  describe('POST /', () => {
    it('should create a new sensor', async () => {
      const { status, body } = await request(app)
        .post('/sensors')
        .send({
          name: 'testing-sensor',
          type_id: 'one-wire',
          config: {
            sensorAddress: '',
          },
        });

      expect(status).to.eq(201);
      expect(body).to.haveOwnProperty('id');

      const sensorRepository = getRepository(Sensor);

      const refetchedSensors = await sensorRepository.find({ where: {} });
      expect(refetchedSensors).to.have.lengthOf(1);
    });
  });
});
