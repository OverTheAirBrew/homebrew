import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanup, IRepositories } from './utils/cleanup';
import { createApplication } from './utils/test-modules';

describe('Devices (e2e)', () => {
  let app: INestApplication;
  let repositories: IRepositories;

  beforeEach(async () => {
    const { moduleFixtures, app: nestApplication } = await createApplication();
    app = nestApplication;

    repositories = await cleanup(moduleFixtures);
  });

  it('GET /', async () => {
    const [{ id: id1 }, { id: id2 }] = await repositories.devices.bulkCreate([
      {
        name: 'test-device',
        type_id: 'local-device',
        config: {},
      },
      {
        name: 'test-device2',
        type_id: 'local-device',
        config: {},
      },
    ]);

    const { status, body } = await request(app.getHttpServer())
      .get('/devices')
      .send();

    expect(status).toBe(200);
    expect(body).toHaveLength(2);

    expect(body).toMatchObject([
      {
        id: id1,
        name: 'test-device',
        type_id: 'local-device',
        config: {},
      },
      {
        id: id2,
        name: 'test-device2',
        type_id: 'local-device',
        config: {},
      },
    ]);
  });
});
