import { Actor } from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { ActorTypeDto } from '../../models/dto/actor-dto';
import { PropertyMapper } from '../property-mapper';

@Service()
export class ActorTypesService {
  constructor(
    @InjectMany('actor') private actors: Actor[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getActorTypes() {
    return await Promise.all(
      this.actors.map((actor) => this.mapActorType(actor)),
    );
  }

  private async mapActorType(actor: Actor) {
    const mappedProperties = await Promise.all(
      actor.properties.map((p) => this.propertyMapper.map(p)),
    );

    return new ActorTypeDto(actor.actorName, mappedProperties);
  }
}
