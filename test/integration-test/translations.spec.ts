import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';
import { clearDatabase } from './helpers/db';

describe('translation', () => {
  let app: Application;

  beforeEach(async () => {
    app = await startServer(true);
    await clearDatabase();
  });

  describe('GET /', () => {
    it('should return a translations response', async () => {
      const { status, body } = await request(app).get('/translations').send({});

      expect(status).to.eq(200);

      expect(body).to.haveOwnProperty('translations');
      expect(body).to.haveOwnProperty('namespaces');
      expect(body).to.haveOwnProperty('locales');
    });
  });
});
