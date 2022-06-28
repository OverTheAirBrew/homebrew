import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { cleanup, IRepositories } from './cleanup';
import { TEST_MODULES } from './test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Actors (e2e)', () => {
  let app: INestApplication;

  let repositories: IRepositories;

  let device_id: string;

  beforeEach(async () => {
    const moduleFixtures = await Test.createTestingModule(
      TEST_MODULES,
    ).compile();

    app = moduleFixtures.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    repositories = await cleanup(moduleFixtures);

    ({ id: device_id } = await repositories.devices.create({
      name: 'test-device',
      type_id: 'local-device',
    }));
  });

  it('GET /', async () => {
    const { id } = await repositories.actors.create({
      name: 'testingactor',
      device_id,
      type_id: 'testing',
      config: '{}',
    });

    const { status, body } = await request(app.getHttpServer()).get('/actors');

    expect(status).toBe(200);

    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(id);
  });

  it('POST /', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/actors')
      .send({
        name: 'testing-actor',
        device_id,
        type_id: 'gpio-actor',
        config: {
          gpioNumber: 1,
        },
      });

    expect(status).toBe(201);

    const currentActors = await repositories.actors.findAll({ where: {} });
    expect(currentActors).toHaveLength(1);

    expect(body.id).toBe(currentActors[0].id);
  });
});
