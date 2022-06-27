import { Inject, Injectable } from '@nestjs/common';
import { Actor } from '../../../database/models/actor';
import { ActorDto } from '../../../models/dto/actor.dto';
import { ActorRepository } from '../../constants';
import { ActorDoesNotExistError } from '../../errors/actor-does-not-exist-error';

@Injectable()
export class ActorService {
  constructor(@Inject(ActorRepository) private repository: typeof Actor) {}

  public async createActor(
    name: string,
    device_id: string,
    type_id?: string,
    config?: string,
  ) {
    const createdActor = await this.repository.create({
      name,
      device_id,
      type_id,
      config,
    });

    return createdActor.id;
  }

  public async getAllActors() {
    const actors = await this.repository.findAll({ where: {} });

    return actors.map((actor) => {
      return new ActorDto(
        actor.id,
        actor.name,
        actor.device_id,
        actor.type_id,
        actor.config,
      );
    });
  }

  public async getActorById(id: string) {
    const actor = await this.repository.findByPk(id);

    if (!actor) {
      throw new ActorDoesNotExistError(id);
    }

    return new ActorDto(
      actor.id,
      actor.name,
      actor.device_id,
      actor.type_id,
      actor.config,
    );
  }
}
