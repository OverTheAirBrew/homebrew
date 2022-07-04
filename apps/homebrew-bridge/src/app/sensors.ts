import { Controller, Get, Param } from '@nestjs/common';

@Controller('sensors')
export class SensorController {
  @Get('/:sensorType/latest-reading')
  async getSensorReading(@Param('sensorType') sensorType: string) {
    return {
      sensorType,
      reading: '42',
    };
  }
}
