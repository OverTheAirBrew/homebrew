import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ActorService } from '../lib/actors/service';

@Controller('actors')
export class ActorController {
  constructor(private actorService: ActorService) {}

  @Post('gpio/on')
  @HttpCode(HttpStatus.NO_CONTENT)
  async turnOnGpioPin(@Body() body: { pin: number }) {
    await this.actorService.enableActor('gpio-actor', {
      gpio: body.pin,
    });

    return;
  }

  @Post('gpio/off')
  @HttpCode(HttpStatus.NO_CONTENT)
  async turnOffGpioPin(@Body() body: { pin: number }) {
    await this.actorService.disableActor('gpio-actor', {
      gpio: body.pin,
    });

    return;
  }
}
