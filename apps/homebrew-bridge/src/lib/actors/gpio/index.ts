import { Injectable } from '@nestjs/common';
import { Gpio } from 'onoff';

import { Actor, IActor } from '@ota-internal/shared';

interface IGpioActorParams {
  gpio: number;
}

@Injectable()
export class GpioActor
  extends Actor<IGpioActorParams>
  implements IActor<IGpioActorParams>
{
  constructor() {
    super('gpio', [], undefined);
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
