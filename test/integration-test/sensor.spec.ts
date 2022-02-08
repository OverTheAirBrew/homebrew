import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { getRepository } from 'typeorm';
import { startServer } from '../../src/app/controllers';
import { Sensor } from '../../src/app/orm/models/sensor';
import { clearDatabase, IDbRepositories } from './helpers/db';

describe('sensor', () => {
  let app: Application;
  let repositories: IDbRepositories;

  beforeEach(async () => {
    app = await startServer(true);
    repositories = await clearDatabase();
  });

  describe('POST /', () => {
    it('should create a new sensor', async () => {
      const { status, body } = await request(app)
        .post('/sensors')
        .send({
          name: 'testing-sensor',
          type_id: 'one-wire-sensor',
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

  describe('GET /:sensorId', () => {
    it('should return the correct sensor', async () => {
      const [_, sensor2] = await repositories.sensor.save([
        {
          name: 'sensor1',
          type_id: 'sensor1-type',
          config: '{}',
        },
        {
          name: 'sensor2',
          type_id: 'sensor2-type',
          config: '{"hello": "world"}',
        },
      ]);

      const { status, body } = await request(app)
        .get(`/sensors/${sensor2.id}`)
        .send();

      expect(status).to.eq(200);
      expect(body).to.deep.eq({
        id: sensor2.id,
        name: 'sensor2',
        type_id: 'sensor2-type',
        config: {
          hello: 'world',
        },
      });
    });
  });

  describe('GET /', () => {
    it('should return all sensors', async () => {
      const [s1, s2] = await repositories.sensor.save([
        {
          name: 'sensor1',
          type_id: 'sensor1-type',
          config: '{"sensor1": true}',
        },
        {
          name: 'sensor2',
          type_id: 'sensor2-type',
          config: '{"sensor2": true}',
        },
      ]);

      const { status, body } = await request(app).get('/sensors').send({});

      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          id: s1.id,
          name: 'sensor1',
          type_id: 'sensor1-type',
          config: {
            sensor1: true,
          },
        },
        {
          id: s2.id,
          name: 'sensor2',
          type_id: 'sensor2-type',
          config: {
            sensor2: true,
          },
        },
      ]);
    });
  });
});
