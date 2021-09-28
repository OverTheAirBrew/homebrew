import { Get, HttpCode, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { SensorTypeDto } from '../lib/models/sensor-type-dto';
import { SensorTypeService } from '../lib/sensor-types';

@JsonController()
@Service()
export class SensorTypesController {
  constructor(private service: SensorTypeService) {}

  @Get('/sensor-types')
  @HttpCode(200)
  @ResponseSchema(SensorTypeDto, { isArray: true })
  async getSensorTypes(): Promise<SensorTypeDto[]> {
    const sensorTypes = await this.service.getSensorTypes();
    return sensorTypes;
  }
}
