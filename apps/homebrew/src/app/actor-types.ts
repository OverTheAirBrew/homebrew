import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActorTypesService } from '../lib/services/actor-types/service';
import { ActorTypeDto } from '../models/dto/actor-type.dto';

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
