import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';
import { clearDatabase } from './helpers/db';

describe('logic-types', () => {
  let app: Application;

  before(async () => {
    app = await startServer(true);
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /', () => {
    it('should return the types', async () => {
      const { status, body } = await request(app).get('/logic-types').send();

      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          properties: [
            {
              id: 'p',
              isRequired: true,
              name: 'pid-logic:p',
              type: 'number',
            },
            {
              id: 'i',
              isRequired: true,
              name: 'pid-logic:i',
              type: 'number',
            },
            {
              id: 'd',
              isRequired: true,
              name: 'pid-logic:d',
              type: 'number',
            },
            {
              id: 'maxOutput',
              isRequired: false,
              name: 'pid-logic:maxOutput',
              type: 'number',
            },
          ],
          type: 'pid-logic',
        },
      ]);
    });
  });
});
