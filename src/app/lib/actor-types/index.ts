import { InjectMany, Service } from 'typedi';
import { ActorTypeDto } from '../../models/dto/actor-dto';
import { ACTOR_TOKEN } from '../plugin';
import { Actor } from '../plugin/abstractions/actor';
import { PropertyMapper } from '../property-mapper';

@Service()
export class ActorTypesService {
  constructor(
    @InjectMany(ACTOR_TOKEN) private actors: Actor<any>[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getActorTypes() {
    return await Promise.all(
      this.actors.map((actor) => this.mapActorType(actor)),
    );
  }

  public async getRawActorTypeById(id: string) {
    const sensorType = this.actors.find((s) => s.name === id);

    if (!sensorType) {
      throw new Error('Invalid actor type id');
    }

    return sensorType;
  }

  public async getActorTypeById(id: string) {
    const actorType = await this.getRawActorTypeById(id);
    return this.mapActorType(actorType);
  }

  public async validateConfig(type_id: string, config: any) {
    const actorType = await this.getRawActorTypeById(type_id);
    return await actorType.validate(config);
  }

  private async mapActorType(actor: Actor<any>) {
    const mappedProperties = await Promise.all(
      actor.properties.map((p) => this.propertyMapper.map(actor.name, p)),
    );

    return new ActorTypeDto(actor.name, mappedProperties);
  }
}
