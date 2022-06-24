import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TEST_MODULES } from './test-modules';

describe('Translations (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixtures = await Test.createTestingModule({
      imports: [...TEST_MODULES],
    }).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();
  }, 30000);

  it('GET /', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/translations',
    );

    expect(status).toBe(200);

    expect(body).toHaveProperty('locales');
    expect(body).toHaveProperty('namespaces');
    expect(body).toHaveProperty('translations');
  });
});
