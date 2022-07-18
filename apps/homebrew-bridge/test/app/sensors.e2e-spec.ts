import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApplication } from '../utils/test-modules';

import { DS18B20Controller } from '@ota-internal/one-wire-sensor';

jest.mock('@ota-internal/one-wire-sensor');

describe('Sensors (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { app: nestApplication } = await createApplication();
    app = nestApplication;
  });

  it('GET /sensors/one-wire/addresses', async () => {
    const { status } = await request(app.getHttpServer())
      .get('/sensors/one-wire/addresses')
      .send();

    expect(status).toBe(200);
    expect(DS18B20Controller.prototype.findDevices).toHaveBeenCalled();
  });

  it('GET /sensors/one-wire/latest-reading', async () => {
    (DS18B20Controller.prototype.findDevices as jest.Mock).mockResolvedValue([
      '0x12345678',
    ]);

    (
      DS18B20Controller.prototype.getCurrentValue as jest.Mock
    ).mockResolvedValue({
      celcius: 12,
    });

    const { status, body } = await request(app.getHttpServer())
      .get('/sensors/one-wire/latest-reading')
      .query({
        sensorAddress: '0x12345678',
      });

    expect(status).toBe(200);
    expect(DS18B20Controller.prototype.getCurrentValue).toHaveBeenCalled();
  });
});
