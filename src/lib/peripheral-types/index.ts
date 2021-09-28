import {
  Actor as ActorType,
  ActorToken,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { PeripheralTypeDto } from '../models/peripheral-type-dto';

@Service()
export class PeripheralTypeService {
  constructor(
    @InjectMany(ActorToken) private actors: ActorType[],
    public propMapper: PropertyTypeMapper,
  ) {}

  public async getPeripheralTypes() {
    const peripheralTypes = await Promise.all(
      this.actors.map(async (actor) => {
        const properties = await Promise.all(
          actor.properties.map(this.propMapper.map),
        );
        return new PeripheralTypeDto(actor.actorName, properties);
      }),
    );

    return peripheralTypes;
  }
}
