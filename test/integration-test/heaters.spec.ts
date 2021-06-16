import { cleanup } from './utils/cleanup';
import * as request from 'supertest';

import { app } from '../../app';
import { expect } from 'chai';
import { Peripheral } from '../../app/orm/models/peripherals';

describe('heaters', () => {
  beforeEach(async () => {
    await cleanup();
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
