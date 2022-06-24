import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TEST_MODULES } from './test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Sensor Types (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixtures = await Test.createTestingModule({
      imports: [...TEST_MODULES],
    }).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();
  });

  it('GET /', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/sensor-types')
      .send();

    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});
