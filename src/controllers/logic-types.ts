import { Get, HttpCode, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LogicTypeService } from '../lib/logic-types';
import { LogicTypeDto } from '../lib/models/logic-type-dto';

@JsonController()
@Service()
export class LogicTypesController {
  constructor(private service: LogicTypeService) {}

  @Get('/logic-types')
  @HttpCode(200)
  @ResponseSchema(LogicTypeDto, { isArray: true })
  async getSensorTypes(): Promise<LogicTypeDto[]> {
    const logicTypes = await this.service.getLogicTypes();
    return logicTypes;
  }
}
