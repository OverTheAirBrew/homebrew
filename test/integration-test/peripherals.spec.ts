import { expect } from 'chai';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import Peripheral from '../../src/orm/models/peripheral';
import { cleanup } from './utils/cleanup';
import { application, applicationReady } from './utils/test-application';

describe('peripherals', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = await cleanup();
    await applicationReady();
  });

  describe('POST /peripherals', () => {
    it('should create a new peripheral', async () => {
      const { status } = await request(application.server)
        .post('/server/peripherals')
        .send({
          name: 'testing peripheral',
          type_id: 'test-actor',
          config: {
            test: true,
          },
        });

      expect(status).to.eq(201);

      const refetchedPeripherals = await sequelize
        .getRepository(Peripheral)
        .findAll({ where: {} });

      expect(refetchedPeripherals).to.have.lengthOf(1);
      expect(refetchedPeripherals[0].name).to.eq('testing peripheral');
    });
  });

  describe('GET /peripherals', () => {
    it('should get a saved sensor', async () => {
      const [{ id }] = await sequelize.getRepository(Peripheral).bulkCreate([
        {
          name: 'testing 1',
          type_id: 'testing-sensor',
          config: {},
        },
      ]);

      const { status, body } = await request(application.server)
        .get('/server/peripherals')
        .send();

      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          id,
          name: 'testing 1',
          type_id: 'testing-sensor',
          config: {},
        },
      ]);
    });
  });

  describe('GET /peripherals/:id', () => {
    it('should get a saved sensor', async () => {
      const [{ id }] = await sequelize.getRepository(Peripheral).bulkCreate([
        {
          name: 'testing 1',
          type_id: 'testing-sensor',
          config: {},
        },
        {
          name: 'testing 2',
          type_id: 'testing-sensor 2',
          config: {},
        },
      ]);

      const { status, body } = await request(application.server)
        .get(`/server/peripherals/${id}`)
        .send();

      expect(status).to.eq(200);
      expect(body).to.deep.eq({
        id,
        name: 'testing 1',
        type_id: 'testing-sensor',
        config: {},
      });
    });
  });
});
