import { Get, HttpCode, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { ActorTypesService } from '../lib/actor-types';

@JsonController('/actor-types')
@Service()
export class ActorTypesController {
  constructor(private actorTypesService: ActorTypesService) {}

  @Get('/')
  @HttpCode(200)
  async getActorTypes() {
    return await this.actorTypesService.getActorTypes();
  }
}
