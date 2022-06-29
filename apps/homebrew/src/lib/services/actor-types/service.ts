import { Injectable } from '@nestjs/common';
import { ActorTypeDto } from '../../../models/dto/actor-type.dto';
import { ActorDoesNotExistError } from '../../errors/actor-does-not-exist-error';
import { IActor } from '../../plugin/abstractions/actor';
import { PropertyMapper } from '../../property-mapper';
import { DeviceTypesService } from '../device-types/service';

@Injectable()
export class ActorTypesService {
  constructor(
    private deviceTypesService: DeviceTypesService,
    private mapper: PropertyMapper,
  ) {}

  public async getActorTypes(deviceType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );
    return await Promise.all(device.actors.map(this.mapActorType));
  }

  public async getRawActorTypeById(deviceType: string, actorType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );
    const actor = device.actors.find((a) => a.name === actorType);

    if (!actor) {
      throw new ActorDoesNotExistError(actorType);
    }

    return actor;
  }

  public async validateConfig<T>(
    deviceType: string,
    actorType: string,
    config: T,
  ) {
    const actor = await this.getRawActorTypeById(deviceType, actorType);
    return await actor.validate(config);
  }

  private async mapActorType(actor: IActor<any>) {
    const mappedProperties = await Promise.all(
      actor.properties.map((p) => this.mapper.map(actor.name, p)),
    );

    return new ActorTypeDto(actor.name, mappedProperties);
  }
}
