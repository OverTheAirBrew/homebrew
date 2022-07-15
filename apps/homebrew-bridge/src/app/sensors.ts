import { Controller, Get, Query } from '@nestjs/common';
import { SensorService } from '../lib/sensors/service';

@Controller('sensors')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Get('one-wire/addresses')
  async getOneWireAddresses() {
    const addresses = await this.sensorService.getSensorAddresses(
      'one-wire-sensor',
    );

    return {
      addresses,
    };
  }

  @Get('/one-wire/latest-reading')
  async getSensorReading(@Query('sensorAddress') sensorAddress: string) {
    const reading = await this.sensorService.getReading('one-wire-sensor', {
      sensorAddress,
    });

    return {
      reading,
    };
  }
}
