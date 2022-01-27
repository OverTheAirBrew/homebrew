import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';
import { SensorService } from '../lib/sensor';
import { Sensor } from '../models/controller/sensor';

@JsonController('/sensors')
@Service()
export class SensorController {
  constructor(private service: SensorService) {}

  @Post('/')
  @HttpCode(201)
  async createSensor(@Body() sensor: Sensor) {
    return await this.service.createNewSensor(sensor);
  }

  @Get('/:sensorId')
  async getSensorById(@Param('sensorId') sensorId: string) {
    return await this.service.getSensorById(sensorId);
  }
}
