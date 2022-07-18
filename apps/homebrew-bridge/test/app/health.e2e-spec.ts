import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApplication } from '../utils/test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const onOffStub = jest.fn().mockResolvedValue({});

    const { app: nestApplication } = await createApplication();
    app = nestApplication;
  });

  it('GET /', async () => {
    const { status } = await request(app.getHttpServer()).get('/health');
    expect(status).toBe(204);
  });
});
