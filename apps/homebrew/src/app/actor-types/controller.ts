import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActorTypeDto } from '../../models/dto/actor-type.dto';
import { ActorTypesService } from './service';

@ApiTags('actor-types')
@Controller('actor-types')
export class ActorTypesController {
  constructor(private actorTypesService: ActorTypesService) {}

  @Get('/')
  @ApiOkResponse({
    type: ActorTypeDto,
    isArray: true,
  })
  async get(): Promise<ActorTypeDto[]> {
    return await this.actorTypesService.getActorTypes();
  }
}
