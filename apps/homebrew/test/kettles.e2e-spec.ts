import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { cleanup, IRepositories } from './cleanup';
import { TEST_MODULES } from './test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Kettles (e2e)', () => {
  let app: INestApplication;

  let repositories: IRepositories;

  beforeEach(async () => {
    let moduleFixtures = await Test.createTestingModule(TEST_MODULES).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();

    repositories = await cleanup(moduleFixtures);
  });

  it('POST /', async () => {
    const [{ id: actorId }, { id: sensorId }] = await Promise.all([
      repositories.actors.create({
        name: 'testingactor',
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
        type_id: 'one-wire',
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
        logicType_id: 'pid',
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
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
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
        type_id: 'gpio',
        config: {
          gpioNumber: 1,
        },
      }),
      repositories.sensors.create({
        name: 'testingsensor',
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
});
