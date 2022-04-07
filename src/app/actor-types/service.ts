import { Inject, Injectable } from '@nestjs/common';
import { IActors } from '../../lib/constants';
import { InvalidActorTypeError } from '../../lib/errors/invalid-sensor-type';
import { IActor } from '../../lib/plugin/abstractions/actor';
import { PropertyMapper } from '../../lib/property-mapper';
import { ActorTypeDto } from '../../models/dto/actor-type.dto';

@Injectable()
export class ActorTypesService {
  constructor(
    @Inject(IActors) private actorTypes: IActor<any>[],
    private mapper: PropertyMapper,
  ) {}

  public async getActorTypes() {
    return await Promise.all(
      this.actorTypes.map((actor) => this.mapActorType(actor)),
    );
  }

  public async getRawActorTypeById(id: string) {
    const sensorType = this.actorTypes.find((s) => s.name === id);

    if (!sensorType) {
      throw new InvalidActorTypeError(id);
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

  private async mapActorType(actor: IActor<any>) {
    const mappedProperties = await Promise.all(
      actor.properties.map((p) => this.mapper.map(actor.name, p)),
    );

    return new ActorTypeDto(actor.name, mappedProperties);
  }
}
