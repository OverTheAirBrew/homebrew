import { Inject, Injectable } from '@nestjs/common';
import { Actor } from '../../database/models/actor';
import { ActorRepository } from '../../lib/constants';
import { ActorDto } from '../../models/dto/actor.dto';
import { IdResponseDto } from '../../models/dto/id-response.dto';

@Injectable()
export class ActorService {
  constructor(@Inject(ActorRepository) private repository: typeof Actor) {}

  public async createActor(name: string, type_id?: string, config?: string) {
    const createdActor = await this.repository.create({
      name,
      type_id,
      config,
    });

    return new IdResponseDto(createdActor.id);
  }

  public async getAllActors() {
    const actors = await this.repository.findAll();

    return actors.map((actor) => {
      const parsedConfig = JSON.parse(actor.config);
      return new ActorDto(actor.id, actor.name, actor.type_id, parsedConfig);
    });
  }

  public async getActorById(id: string) {
    const actor = await this.repository.findByPk(id);

    if (!actor) {
      throw new Error('Actor not found');
    }

    return new ActorDto(
      actor.id,
      actor.name,
      actor.type_id,
      JSON.parse(actor.config),
    );
  }
}