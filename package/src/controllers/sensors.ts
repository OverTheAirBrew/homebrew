import { HttpCode, JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { IdResponse } from '../lib/models/id-response';

@JsonController()
@Service()
export class SensorController {
  @Post('/sensors')
  @HttpCode(201)
  @ResponseSchema(IdResponse)
  async createSensor() {}
}
