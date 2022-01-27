import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { Actor } from '../../orm/models/actor';

@Service()
export class ActorRepository {
  private connection: Repository<Actor>;

  constructor() {
    this.connection = getRepository(Actor);
  }

  async saveActor<T>(name: string, type_id: string, config: T) {
    const actor = await this.connection.save({
      name,
      type_id,
      config: JSON.stringify(config),
    });

    return actor.id;
  }
}
