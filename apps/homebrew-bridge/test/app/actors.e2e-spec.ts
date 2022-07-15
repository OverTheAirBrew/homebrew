import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApplication } from '../utils/test-modules';

import { Gpio } from 'onoff';

jest.useFakeTimers();
jest.retryTimes(3);

jest.mock('onoff');

describe('Actors (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { app: nestApplication } = await createApplication();
    app = nestApplication;
  });

  it('POST /actors/gpio/on', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/actors/gpio/on')
      .send({
        pin: 10,
      });

    expect(status).toBe(204);
    expect(Gpio.prototype.writeSync).toHaveBeenCalled();
    expect(Gpio.prototype.writeSync).toBeCalledWith(1);
  });

  it('POST /actors/gpio/off', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/actors/gpio/off')
      .send({
        pin: 10,
      });

    expect(status).toBe(204);
    expect(Gpio.prototype.writeSync).toHaveBeenCalled();
    expect(Gpio.prototype.writeSync).toBeCalledWith(0);
  });
});
