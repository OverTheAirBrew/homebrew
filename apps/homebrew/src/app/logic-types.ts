import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LogicTypesService } from '../lib/services/logic-types/service';
import { LogicTypeDto } from '../models/dto/logic-type.dto';

@ApiTags('logic-types')
@Controller('logic-types')
export class LogicTypesController {
  constructor(private service: LogicTypesService) {}

  @Get('/')
  @ApiOkResponse({
    type: LogicTypeDto,
    isArray: true,
  })
  async get() {
    return await this.service.getLogicTypes();
  }
}
