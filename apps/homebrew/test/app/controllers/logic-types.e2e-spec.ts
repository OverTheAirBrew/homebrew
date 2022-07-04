import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApplication } from '../../utils/test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Logic Types (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { app: nestApplication } = await createApplication();
    app = nestApplication;
  });

  it('GET /', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/logic-types')
      .send();

    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});
