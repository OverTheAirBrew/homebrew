import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanup, IRepositories } from '../../utils/cleanup';
import { createApplication } from '../../utils/test-modules';

describe('Device-Types (e2e)', () => {
  let app: INestApplication;
  let repositories: IRepositories;

  beforeEach(async () => {
    const { moduleFixtures, app: nestApplication } = await createApplication();
    app = nestApplication;

    repositories = await cleanup(moduleFixtures);
  });

  it('GET /', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/device-types',
    );

    expect(status).toBe(200);
    expect(body).toHaveLength(1);

    expect(body.some((b) => b.type === 'local-device')).toBeTruthy();
  });

  it('GET /:deviceType/sensor-types', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/device-types/local-device/sensor-types',
    );

    expect(status).toBe(200);
    expect(body.some((b) => b.type === 'one-wire-sensor')).toBeTruthy();
  });

  it('GET /:deviceType/actor-types', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/device-types/local-device/actor-types',
    );

    expect(status).toBe(200);
    expect(body.some((b) => b.type === 'gpio-actor')).toBeTruthy();
  });
});
