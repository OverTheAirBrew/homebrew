import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { cleanup, IRepositories } from './cleanup';
import { TEST_MODULES } from './test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Sensors (e2e', () => {
  let app: INestApplication;
  let repositories: IRepositories;

  beforeEach(async () => {
    let moduleFixtures = await Test.createTestingModule({
      imports: [...TEST_MODULES],
    }).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();

    repositories = await cleanup(moduleFixtures);
  });

  it('POST /', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/sensors')
      .send({
        name: 'test-sensor',
        type_id: 'one-wire',
        config: {
          sensorAddress: '1234',
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
        type_id: 'one-wire',
        config: {},
      },
      {
        name: 'sensor2',
        type_id: 'one-wire',
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
        type_id: 'one-wire',
        config: {},
      },
      {
        name: 'sensor2',
        type_id: 'one-wire',
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
