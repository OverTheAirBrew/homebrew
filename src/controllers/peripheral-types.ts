import { Get, HttpCode, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { PeripheralTypeDto } from '../lib/models/peripheral-type-dto';
import { PeripheralTypeService } from '../lib/peripheral-types';

@JsonController()
@Service()
export class PeripheralTypesController {
  constructor(private service: PeripheralTypeService) {}

  @Get('/peripheral-types')
  @HttpCode(200)
  @ResponseSchema(PeripheralTypeDto, { isArray: true })
  async getSensorTypes(): Promise<PeripheralTypeDto[]> {
    const peripheralTypes = await this.service.getPeripheralTypes();
    return peripheralTypes;
  }
}
