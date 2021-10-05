import { expect } from 'chai';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import Sensor from '../../src/orm/models/sensor';
import { cleanup } from './utils/cleanup';
import { application, applicationReady } from './utils/test-application';

describe('sensors', () => {
  let sequelize: Sequelize;

  before(async () => {
    ({ sequelize } = await cleanup());
    await applicationReady();
  });

  describe('POST /sensors', () => {
    it('should save the sensor when its config is correct', async () => {
      const { status } = await request(application.server)
        .post('/server/sensors')
        .send({
          name: 'testing sensor',
          type_id: 'testing-sensor',
          config: {
            data: true,
          },
        });

      expect(status).to.eq(201);

      const refetchedSensors = await sequelize
        .getRepository(Sensor)
        .findAll({ where: {} });

      expect(refetchedSensors).to.have.lengthOf(1);
      expect(refetchedSensors[0].name).to.eq('testing sensor');
    });
  });
});
