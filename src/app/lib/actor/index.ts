import { Service } from 'typedi';
import { Actor } from '../../orm/models/actor';
import { ActorRepository } from './repository';
import { ActorValidator } from './validator';

@Service()
export class ActorService {
  constructor(
    private validator: ActorValidator,
    private actorRepository: ActorRepository,
  ) {}

  async createNewActor(actor: { name: string; type_id: string; config: any }) {
    const errors = await this.validator.validateAsync(actor);

    if (await this.validator.isValid(errors)) {
      const id = await this.actorRepository.saveActor(
        actor.name,
        actor.type_id,
        actor.config,
      );

      return { id };
    }

    throw new Error('Invalid actor');
  }

  async getAllActors() {
    const actors = await this.actorRepository.getAllActors();
    return await Promise.all(actors.map((actor) => this.mapActor(actor)));
  }

  private async mapActor(actor: Actor) {
    return {
      id: actor.id,
      name: actor.name,
      type_id: actor.type_id,
      config: JSON.parse(actor.config),
    };
  }
}
