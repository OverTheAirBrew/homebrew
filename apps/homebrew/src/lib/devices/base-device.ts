import { ClassType } from '@ota-internal/shared';
import { ActorTypeDto } from '../../models/dto/actor-type.dto';
import { SensorTypeDto } from '../../models/dto/sensor-type.dto';
import { InvalidActorTypeError } from '../errors/invalid-actor-type';
import { InvalidSensorTypeError } from '../errors/invalid-sensor-type';
import { IActor } from '../plugin/abstractions/actor';
import { ISensor } from '../plugin/abstractions/sensor';
import {
  IPeripheral,
  Peripheral,
  PeripheralLocalizations,
  Property,
} from '../plugin/properties';
import { PropertyMapper } from '../property-mapper';

export interface IDevice<T> extends IPeripheral {
  getSensorTypes(): Promise<SensorTypeDto[]>;
  getActorTypes(): Promise<ActorTypeDto[]>;
}

export const IDevice = class Dummy {} as ClassType<IDevice<any>>;

export abstract class Device<T> extends Peripheral implements IDevice<T> {
  constructor(
    name: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
    private actors: IActor<any>[],
    private sensors: ISensor<any>[],
    private mapper: PropertyMapper,
  ) {
    super(`${name}-device`, properties, localizations);
  }

  public async getSensorTypes() {
    return await Promise.all(
      this.sensors.map((sensor) => this.mapSensorType(sensor)),
    );
  }

  public async getActorTypes() {
    return await Promise.all(
      this.actors.map((actor) => this.mapActorType(actor)),
    );
  }

  public async getRawSensorTypeById(sensorType_id: string) {
    const sensorType = this.sensors.find((s) => s.name === sensorType_id);

    if (!sensorType) {
      throw new InvalidSensorTypeError(sensorType_id);
    }

    return sensorType;
  }

  public async getRawActorById(actorType_id: string) {
    const actorType = this.actors.find((a) => a.name === actorType_id);

    if (!actorType) {
      throw new InvalidActorTypeError(actorType_id);
    }

    return actorType;
  }

  public async getActorTypeById(actorType_id: string) {
    const actorType = await this.getRawActorById(actorType_id);
    return await this.mapActorType(actorType);
  }

  public async getSensorTypeById(sensorType_id: string) {
    const sensorType = await this.getRawSensorTypeById(sensorType_id);
    return await this.mapSensorType(sensorType);
  }

  public async validateConfig<T>(
    type: 'actor' | 'sensor',
    type_id: string,
    config: T,
  ) {
    if (type === 'actor') {
      const actorType = await this.getRawActorById(type_id);
      return await actorType.validate(config);
    } else if (type === 'sensor') {
      const sensorType = await this.getRawSensorTypeById(type_id);
      return await sensorType.validate(config);
    }
  }

  private async mapActorType(actor: IActor<any>) {
    const mappedProperties = await Promise.all(
      actor.properties.map((p) => this.mapper.map(actor.name, p)),
    );

    return new ActorTypeDto(actor.name, mappedProperties);
  }

  private async mapSensorType(sensor: ISensor<any>) {
    const mappedProperties = await Promise.all(
      sensor.properties.map((p) => this.mapper.map(sensor.name, p)),
    );

    return new SensorTypeDto(sensor.name, mappedProperties);
  }
}
