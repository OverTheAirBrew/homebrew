import { Body, Controller, Post } from '@nestjs/common';
import { ActorService } from '../lib/actors/service';

@Controller('actors')
export class ActorController {
  constructor(private actorService: ActorService) {}

  @Post('gpio/on')
  async turnOnGpioPin(@Body() body: { pin: number }) {
    await this.actorService.enableActor('gpio-actor', {
      gpio: body.pin,
    });

    return;
  }

  @Post('gpio/off')
  async turnOffGpioPin(@Body() body: { pin: number }) {
    await this.actorService.disableActor('gpio-actor', {
      gpio: body.pin,
    });

    return;
  }
}
