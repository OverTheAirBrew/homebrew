import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';

describe('actor-types', () => {
  let app: Application;

  before(async () => {
    app = await startServer(true);
  });

  describe('GET', () => {
    it('should return actor types', async () => {
      const { status, body } = await request(app).get('/actor-types').send({});

      expect(status).to.eq(200);

      expect(body).to.have.lengthOf(1);

      const gpioType = body.find((a) => a.type === 'gpio');
      expect(gpioType).to.not.be.undefined;

      expect(gpioType).to.deep.eq({
        type: 'gpio',
        properties: [
          {
            isRequired: true,
            id: 'gpioNumber',
            name: 'gpio.gpioNumber',
            selectBoxValues: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26, 27, 28,
            ],
            type: 'select-box',
          },
        ],
      });
    });
  });
});
