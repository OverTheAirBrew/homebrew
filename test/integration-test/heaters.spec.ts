import { cleanup } from './utils/cleanup';
import * as request from 'supertest';

import { app } from '../../app';
import { expect } from 'chai';
import { Peripheral } from '../../app/orm/models/peripherals';

describe('heaters', () => {
  beforeEach(async () => {
    await cleanup();
  });

  describe('GET /heaters', () => {
    it('should retun a mapped list of heaters', async () => {
      const [{ id: id1 }, { id: id2 }] = await Peripheral.bulkCreate([
        {
          communicationType: 'gpio',
          name: 'name',
          type: 'heater',
          gpio: 1,
        },
        {
          communicationType: 'gpio',
          name: 'name1',
          type: 'heater',
          gpio: 2,
        },
      ]);

      const { status, body } = await request(app)
        .get('/server/heaters')
        .send()
        .accept('application/json');

      expect(status).to.eq(200);

      expect(body).to.deep.eq([
        {
          id: id1,
          communicationType: 'gpio',
          name: 'name',
          type: 'heater',
          gpio: 1,
        },
        {
          id: id2,
          communicationType: 'gpio',
          name: 'name1',
          type: 'heater',
          gpio: 2,
        },
      ]);
    });
  });

  describe('POST /heaters', () => {
    it('should save the heater if everything is correct', async () => {
      const { status, body } = await request(app)
        .post('/server/heaters')
        .send({
          name: 'name',
          communicationType: 'gpio',
          gpio: 2,
        })
        .accept('application/json');

      expect(status).to.eq(201);

      const databaseData = await Peripheral.findOne({ where: {} });

      expect(databaseData.name).to.eq('name');
      expect(databaseData.type).to.eq('heater');
      expect(databaseData.communicationType).to.eq('gpio');
      expect(databaseData.gpio).to.eq(2);
    });
  });
});
