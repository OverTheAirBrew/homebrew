import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';
import { Kettle } from '../../src/app/orm/models/kettle';
import { clearDatabase, IDbRepositories } from './helpers/db';

describe('kettle', () => {
  let app: Application;
  let repositories: IDbRepositories;

  before(async () => {
    app = await startServer(true);
  });

  beforeEach(async () => {
    repositories = await clearDatabase();
  });

  describe('POST /', () => {
    it('should create a new kettle', async () => {
      const sensor = await repositories.sensor.save({
        name: 'testing-sensor',
        type_id: 'one-wire-sensor',
        config: '{}',
      });

      const actor = await repositories.actor.save({
        name: 'testing-kettle',
        type_id: 'gpio-actor',
        config: '{ "gpioNumber": 1 }',
      });

      const { status } = await request(app)
        .post('/kettles')
        .send({
          name: 'testing-kettle',
          sensor_id: sensor.id,
          heater_id: actor.id,
          logicType_id: 'pid-logic',
          config: {
            p: 1,
            i: 2,
            d: 3,
          },
        });

      expect(status).to.eq(201);

      const refetchedKettle = await repositories.kettle.find({});
      expect(refetchedKettle).to.have.lengthOf(1);
    });
  });

  describe('PUT /:id', () => {
    it('should update the kettle', async () => {
      const [{ id }] = await repositories.kettle.save([
        {
          name: 'testing-actor',
        },
        {
          name: 'testing-actor-2',
        },
      ]);

      const { status } = await request(app).put(`/kettles/${id}`).send({
        name: 'updated-name',
      });

      expect(status).to.eq(204);

      const refetchedActor = await repositories.kettle.findOne({
        where: { id },
      });

      expect(refetchedActor).to.not.be.undefined;
      expect(refetchedActor.name).to.eq('updated-name');
    });
  });

  describe('GET /', () => {
    it('should return kettles', async () => {
      const { id: sensor_id } = await repositories.sensor.save({
        name: 'sensor',
        type_id: 'one-wire-sensor',
        config: JSON.stringify({ sensorAddress: 'testing sensor address' }),
      });

      const { id: heater_id } = await repositories.actor.save({
        name: 'actor',
        type_id: 'gpio-actor',
        config: JSON.stringify({ gpioNumber: 1 }),
      });

      const kettle: Kettle = {
        name: 'testing-kettle',
        sensor: {
          id: sensor_id,
        } as any,
        heater: {
          id: heater_id,
        } as any,
        logicType_id: 'logic-type-1',
        config: JSON.stringify({
          p: 1,
          i: 2,
          d: 3,
        }),
      };

      const { id } = await repositories.kettle.save(kettle);

      const { status, body } = await request(app).get('/kettles').send({});

      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          config: {
            p: 1,
            i: 2,
            d: 3,
          },
          heater_id,
          sensor_id,
          logicType_id: 'logic-type-1',
          id,
          name: 'testing-kettle',
        },
      ]);
    });
  });
});
