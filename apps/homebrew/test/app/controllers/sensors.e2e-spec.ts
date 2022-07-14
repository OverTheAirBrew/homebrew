import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanup, IRepositories } from '../../utils/cleanup';
import { createApplication } from '../../utils/test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Sensors (e2e)', () => {
  let app: INestApplication;
  let repositories: IRepositories;

  let device_id: string;

  beforeEach(async () => {
    const { moduleFixtures, app: nestApplication } = await createApplication();
    app = nestApplication;

    repositories = await cleanup(moduleFixtures);

    ({ id: device_id } = await repositories.devices.create({
      name: 'test-device',
      type_id: 'local-device',
    }));
  });

  it('POST /', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/sensors')
      .send({
        name: 'test-sensor',
        device_id,
        type_id: 'dummy-sensor',
        config: {
          values: '1,2,3',
        },
      });

    expect(status).toBe(201);
    expect(body).toHaveProperty('id');

    const { id } = body;

    const sensors = await repositories.sensors.findAll();
    expect(sensors.some((k) => k.id === id)).toBeTruthy();
  });

  it('GET /', async () => {
    const [{ id: id1 }, { id: id2 }] = await repositories.sensors.bulkCreate([
      {
        name: 'sensor1',
        type_id: 'dummy-sensor',
        device_id,
        config: {},
      },
      {
        name: 'sensor2',
        type_id: 'dummy-sensor',
        device_id,
        config: {},
      },
    ]);

    const { status, body } = await request(app.getHttpServer())
      .get(`/sensors`)
      .send({});

    expect(status).toBe(200);
    expect(body).toHaveLength(2);

    expect(body.some((s) => s.id === id1)).toBeTruthy();
    expect(body.some((s) => s.id === id2)).toBeTruthy();
  });

  it('GET /:id', async () => {
    const [{ id: id1 }, { id: id2 }] = await repositories.sensors.bulkCreate([
      {
        name: 'sensor1',
        type_id: 'dummy-sensor',
        device_id,
        config: {},
      },
      {
        name: 'sensor2',
        type_id: 'dummy-sensor',
        device_id,
        config: {},
      },
    ]);

    const { status, body } = await request(app.getHttpServer())
      .get(`/sensors/${id1}`)
      .send();

    expect(status).toBe(200);
    expect(body.id).toBe(id1);
  });
});
