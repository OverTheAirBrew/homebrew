import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Actor } from '../src/database/models/actor';
import { cleanup } from './cleanup';
import { TEST_MODULES } from './test-modules';

jest.useFakeTimers();
jest.retryTimes(3);

describe('Actors (e2e)', () => {
  let app: INestApplication;

  let repository: typeof Actor;

  beforeEach(async () => {
    const moduleFixtures = await Test.createTestingModule({
      imports: [...TEST_MODULES],
    }).compile();

    app = moduleFixtures.createNestApplication();
    await app.init();

    const { actors } = await cleanup(moduleFixtures);
    repository = actors;
  });

  it('GET /', async () => {
    const { id } = await repository.create({
      name: 'testingactor',
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
        type_id: 'gpio-actor',
        config: {
          gpioNumber: 1,
        },
      });

    expect(status).toBe(201);

    const currentActors = await repository.findAll({ where: {} });
    expect(currentActors).toHaveLength(1);

    expect(body.id).toBe(currentActors[0].id);
  });
});
