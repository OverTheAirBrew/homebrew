import { Get, HttpCode, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { SensorTypesService } from '../lib/sensor-types';

@JsonController('/sensor-types')
@Service()
export class SensorTypesController {
  constructor(private sensorTypesService: SensorTypesService) {}

  @Get('/')
  @HttpCode(200)
  // @ResponseSchema(SensorTypesResponse)
  async getSensorTypes() {
    return await this.sensorTypesService.getSensorTypes();
  }
}
