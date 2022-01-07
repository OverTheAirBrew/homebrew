import { Actor, SelectBoxProperty } from '@overtheairbrew/homebrew-plugin';
import { Gpio } from 'onoff';
import { Service } from 'typedi';

interface IGpioActorParams {
  gpio: number;
}

@Service({ id: 'actor', multiple: true })
export class GpioActor extends Actor {
  constructor() {
    super('gpio', [
      new SelectBoxProperty('gpio.gpioNumber', true, () => [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28,
      ]),
    ]);
  }

  public async on(params: IGpioActorParams) {
    const gpio = new Gpio(params.gpio, 'out');
    gpio.writeSync(1);
  }

  public async off(params: IGpioActorParams) {
    const gpio = new Gpio(params.gpio, 'out');
    gpio.writeSync(0);
  }
}
