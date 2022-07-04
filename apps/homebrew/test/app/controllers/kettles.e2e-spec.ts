import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanup, IRepositories } from '../../utils/cleanup';
import { createApplication } from '../../utils/test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Kettles (e2e)', () => {
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
      config: {},
    }));
  });

  it('POST /', async () => {
    const [{ id: actorId }, { id: sensorId }] = await Promise.all([
      repositories.actors.create({
        name: 'testingactor',
        device_id,
        type_id: 'gpio-actor',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
        device_id,
        type_id: 'one-wire-sensor',
        config: {
          sensorAddress: '1234',
        },
      }),
    ]);

    const { status, body } = await request(app.getHttpServer())
      .post('/kettles')
      .send({
        name: 'test-kettle',
        sensor_id: sensorId,
        actor_id: actorId,
        logicType_id: 'pid-logic',
        config: {
          p: 1,
          i: 1,
          d: 1,
        },
      });

    expect(status).toBe(201);
    expect(body).toHaveProperty('id');

    const { id } = body;

    const kettles = await repositories.kettles.findAll();
    expect(kettles).toHaveLength(1);
    expect(kettles[0].id).toBe(id);
  });

  it('GET /', async () => {
    const [{ id: actorId }, { id: sensorId }] = await Promise.all([
      repositories.actors.create({
        name: 'testingactor',
        device_id,
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
        device_id,
        type_id: 'one-wire',
        config: {
          sensorAddress: '1234',
        },
      }),
    ]);

    const { id: kettleId } = await repositories.kettles.create({
      name: 'testing-kettle',
      sensor_id: sensorId,
      heater_id: actorId,
    });

    const { status, body } = await request(app.getHttpServer())
      .get('/kettles')
      .send();

    expect(status).toBe(200);

    expect(body).toStrictEqual([
      {
        sensor_id: sensorId,
        heater_id: actorId,
        logicType_id: null,
        logicRun_id: null,
        targetTemperature: null,
        config: {},
        id: kettleId,
        name: 'testing-kettle',
      },
    ]);
  });

  it('PUT /', async () => {
    const [{ id: actorId }, { id: sensorId }] = await Promise.all([
      repositories.actors.create({
        name: 'testingactor',
        device_id,
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
        device_id,
        type_id: 'one-wire',
        config: {
          sensorAddress: '1234',
        },
      }),
    ]);

    const { id: kettleId } = await repositories.kettles.create({
      name: 'testing-kettle',
      sensor_id: sensorId,
      heater_id: actorId,
    });

    const { status, body } = await request(app.getHttpServer())
      .put(`/kettles/${kettleId}`)
      .send({
        name: 'testing-kettle-updated',
        sensor_id: sensorId,
        heater_id: actorId,
      });

    expect(status).toBe(204);

    const kettle = await repositories.kettles.findByPk(kettleId);
    expect(kettle.name).toBe('testing-kettle-updated');
  });

  it('GET /:kettleId', async () => {
    const { id: kettleId } = await repositories.kettles.create({
      name: 'testing-kettle',
    });

    const { status, body } = await request(app.getHttpServer())
      .get(`/kettles/${kettleId}`)
      .send();

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: kettleId,
      name: 'testing-kettle',
    });
  });

  it('PATCH /:kettleId/working', async () => {
    const [{ id: actorId }, { id: sensorId }] = await Promise.all([
      repositories.actors.create({
        name: 'testingactor',
        device_id,
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
        device_id,
        type_id: 'one-wire',
        config: {
          sensorAddress: '1234',
        },
      }),
    ]);

    const { id: kettleId } = await repositories.kettles.create({
      name: 'testing-kettle',
      sensor_id: sensorId,
      heater_id: actorId,
      targetTemperature: 10,
      logicType_id: 'logic-type',
    });

    const { status, body } = await request(app.getHttpServer())
      .patch(`/kettles/${kettleId}/working`)
      .send({});

    expect(status).toBe(202);

    const { logicRun_id } = await repositories.kettles.findByPk(kettleId);
    expect(logicRun_id).toBeDefined();
  });
});
