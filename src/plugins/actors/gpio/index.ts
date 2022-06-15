import { Gpio } from 'onoff';
import { Actor, IActor } from '../../../lib/plugin/abstractions/actor';
import { SelectBoxProperty } from '../../../lib/plugin/properties';

interface IGpioActorParams {
  gpio: number;
}

export class GpioActor
  extends Actor<IGpioActorParams>
  implements IActor<IGpioActorParams>
{
  constructor() {
    super(
      'gpio',
      [
        new SelectBoxProperty('gpioNumber', true, () => [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28,
        ]),
      ],
      {
        en: {
          gpioNumber: 'GPIO number',
        },
      },
    );
  }

  protected async processOn(params: IGpioActorParams) {
    const gpio = new Gpio(params.gpio, 'out');
    gpio.writeSync(1);
  }

  protected async processOff(params: IGpioActorParams) {
    const gpio = new Gpio(params.gpio, 'out');
    gpio.writeSync(0);
  }
}
