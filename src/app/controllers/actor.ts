import { Body, Get, HttpCode, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { ActorService } from '../lib/actor';

@JsonController('/actors')
@Service()
export class ActorController {
  constructor(private actorService: ActorService) {}

  @Post('/')
  @HttpCode(201)
  async createActor(
    @Body() actor: { name: string; type_id: string; config: any },
  ) {
    return await this.actorService.createNewActor(actor);
  }

  @Get('/')
  async getActors() {
    return await this.actorService.getAllActors();
  }
}
