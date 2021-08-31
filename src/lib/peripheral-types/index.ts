import { InjectMany, Service } from 'typedi';
import {
  ActorToken,
  Actor as ActorType,
} from '@overtheairbrew/homebrew-plugin';
import { PeripheralTypeDto } from '../models/peripheral-type-dto';

@Service()
export class PeripheralTypeService {
  constructor(@InjectMany(ActorToken) private actors: ActorType[]) {}

  public async getPeripheralTypes() {
    const actorTypes = this.actors.map(
      (actor) => new PeripheralTypeDto(actor.actorName, actor.properties),
    );

    return [...actorTypes];
  }
}
