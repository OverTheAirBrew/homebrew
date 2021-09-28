import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { IdResponse } from '../lib/models/id-response';
import { Sensor } from '../lib/models/sensor';
import { SensorService } from '../lib/sensors';

@JsonController()
@Service()
export class SensorController {
  constructor(private service: SensorService) {}

  @Post('/sensors')
  @HttpCode(201)
  @ResponseSchema(IdResponse)
  async createSensor(@Body() body: Sensor): Promise<{ id: string }> {
    const id = await this.service.createSensor(body);

    return {
      id,
    };
  }
}
