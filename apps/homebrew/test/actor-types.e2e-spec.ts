import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TEST_MODULES } from './test-modules';

describe('Actor Types (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      imports: [...TEST_MODULES],
    }).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();
  });

  it('GET /', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/actor-types',
    );

    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});
