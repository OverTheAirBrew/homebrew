import { expect } from 'chai';
import * as request from 'supertest';
import { application, applicationReady } from './utils/test-application';

describe('sensor-types', () => {
  beforeEach(async () => {
    await applicationReady();
  });

  describe('GET /sensor-types', () => {
    it('should return a list of logic types', async () => {
      const { status, body } = await request(application.server)
        .get('/server/sensor-types')
        .send();

      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          id: 'testing-sensor',
          properties: [],
        },
      ]);
    });
  });
});
