import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { startServer } from '../../src/app/controllers';

describe('sensor-types', () => {
  let app: Application;

  before(async () => {
    app = await startServer(true);
  });

  describe('GET', () => {
    it('should return the sensor types', async () => {
      const { status, body } = await request(app).get('/sensor-types').send({});

      expect(status).to.eq(200);

      expect(body).to.have.lengthOf(1);

      const oneWireType = body.find((b: any) => b.type === 'one-wire-sensor');
      expect(oneWireType).to.not.be.undefined;
      expect(oneWireType).to.deep.eq({
        type: 'one-wire-sensor',
        properties: [
          {
            id: 'sensorAddress',
            isRequired: true,
            name: 'one-wire-sensor:sensorAddress',
            selectBoxValues: ['28-000004c8b8d3'],
            type: 'select-box',
          },
          {
            id: 'offset',
            isRequired: false,
            name: 'one-wire-sensor:offset',
            type: 'number',
          },
        ],
      });
    });
  });
});
