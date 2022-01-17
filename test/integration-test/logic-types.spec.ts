import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';

describe('logic-types', () => {
  let app: Application;

  before(async () => {
    app = await startServer(true);
  });

  describe('GET', () => {
    it('should return logic types', async () => {
      const { status, body } = await request(app).get('/logic-types').send({});

      console.log(body);

      expect(status).to.eq(200);

      expect(body).to.have.lengthOf(1);

      const pidType = body.find((l) => l.type === 'pid');
      expect(pidType).to.not.be.undefined;

      expect(pidType).to.deep.eq({
        type: 'pid',
        properties: [
          {
            isRequired: false,
            name: 'p',
            type: 'number',
          },
          {
            isRequired: false,
            name: 'i',
            type: 'number',
          },
          {
            isRequired: false,
            name: 'd',
            type: 'number',
          },
        ],
      });
    });
  });
});
