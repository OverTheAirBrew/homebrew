import { Injectable } from '@nestjs/common';
import { IActor } from '@ota-internal/shared';
import { ActorTypeDto } from '../../../models/dto/actor-type.dto';
import { InvalidActorTypeError } from '../../errors/invalid-actor-type';
import { PropertyMapper } from '../../property-mapper';
import { DeviceTypesService } from '../device-types/service';
import { DeviceService } from '../device/service';

@Injectable()
export class ActorTypesService {
  constructor(
    private deviceService: DeviceService,
    private deviceTypesService: DeviceTypesService,
    private mapper: PropertyMapper,
  ) {}

  public async getActorTypesForDeviceId(deviceId: string) {
    const device = await this.deviceService.getDeviceById(deviceId);
    return await this.getActorTypes(device.type_id);
  }

  public async getActorTypes(deviceType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );
    return await Promise.all(device.actors.map((a) => this.mapActorType(a)));
  }

  public async getRawActorTypeById(deviceType: string, actorType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );

    const actor = device.actors.find((a) => a.name === actorType);

    if (!actor) {
      throw new InvalidActorTypeError(actorType);
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
      actor.properties.map((p) => {
        return this.mapper.map(actor.name, p);
      }),
    );

    return new ActorTypeDto(actor.name, mappedProperties);
  }
}
