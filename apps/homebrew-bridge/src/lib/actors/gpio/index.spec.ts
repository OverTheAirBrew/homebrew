import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { Gpio } from 'onoff';
import { GpioActor } from '.';

jest.mock('onoff');

describe('plugin/gpio', () => {
  let service: GpioActor;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GpioActor],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    service = moduleRef.get(GpioActor);
  });

  it('should turn on when requested', async () => {
    await service.on('test', { gpio: 10 });

    expect(Gpio.prototype.constructor).toHaveBeenCalledWith(10, 'out');

    expect(Gpio.prototype.writeSync).toHaveBeenCalled();
    expect(Gpio.prototype.writeSync).toHaveBeenCalledWith(1);
  });

  it('should turn off when requested', async () => {
    await service.off('test', { gpio: 10 });

    expect(Gpio.prototype.constructor).toHaveBeenCalledWith(10, 'out');
    expect(Gpio.prototype.writeSync).toHaveBeenCalledWith(0);
  });
});
