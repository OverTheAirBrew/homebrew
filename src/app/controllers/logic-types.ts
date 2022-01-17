import { Get, HttpCode, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { LogicTypesService } from '../lib/logic-types';

@JsonController('/logic-types')
@Service()
export class LogicTypesController {
  constructor(private logicTypesService: LogicTypesService) {}

  @Get('/')
  @HttpCode(200)
  async getLogicTypes() {
    return await this.logicTypesService.getLogicTypes();
  }
}
