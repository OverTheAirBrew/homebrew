import { ClassType } from '@ota-internal/shared';
import { IActor } from '../plugin/abstractions/actor';
import { ISensor } from '../plugin/abstractions/sensor';
import { IPeripheral, Peripheral, Property } from '../plugin/properties';

export interface IDevice<T> extends IPeripheral {
  actors: IActor<any>[];
  sensors: ISensor<any>[];
}

export const IDevice = class Dummy {} as ClassType<IDevice<any>>;

export abstract class Device<T> extends Peripheral implements IDevice<T> {
  constructor(
    name: string,
    properties: Property[],
    public actors: IActor<any>[],
    public sensors: ISensor<any>[],
  ) {
    super(`${name}-device`, properties);
  }

  // public async getSensorTypes() {
  //   return await Promise.all(
  //     this.sensors.map((sensor) => this.mapSensorType(sensor)),
  //   );
  // }

  // public async getRawSensorTypes() {
  //   return this.sensors;
  // }

  // public async getActorTypes() {
  //   return await Promise.all(
  //     this.actors.map((actor) => this.mapActorType(actor)),
  //   );
  // }

  // public async getRawActorTypes() {
  //   return this.actors;
  // }

  // public async getRawSensorTypeById(sensorType_id: string) {
  //   const sensorType = this.sensors.find((s) => s.name === sensorType_id);

  //   if (!sensorType) {
  //     throw new InvalidSensorTypeError(sensorType_id);
  //   }

  //   return sensorType;
  // }

  // public async getRawActorById(actorType_id: string) {
  //   const actorType = this.actors.find((a) => a.name === actorType_id);

  //   if (!actorType) {
  //     throw new InvalidActorTypeError(actorType_id);
  //   }

  //   return actorType;
  // }

  // public async getActorTypeById(actorType_id: string) {
  //   const actorType = await this.getRawActorById(actorType_id);
  //   return await this.mapActorType(actorType);
  // }

  // public async getSensorTypeById(sensorType_id: string) {
  //   const sensorType = await this.getRawSensorTypeById(sensorType_id);
  //   return await this.mapSensorType(sensorType);
  // }

  // public async validateConfig<T>(
  //   type: 'actor' | 'sensor',
  //   type_id: string,
  //   config: T,
  // ) {
  //   if (type === 'actor') {
  //     const actorType = await this.getRawActorById(type_id);
  //     return await actorType.validate(config);
  //   } else if (type === 'sensor') {
  //     const sensorType = await this.getRawSensorTypeById(type_id);
  //     return await sensorType.validate(config);
  //   }
  // }

  // private async mapActorType(actor: IActor<any>) {
  //   const mappedProperties = await Promise.all(
  //     actor.properties.map((p) => this.mapper.map(actor.name, p, this.name)),
  //   );

  //   return new ActorTypeDto(actor.name, mappedProperties);
  // }

  // private async mapSensorType(sensor: ISensor<any>) {
  //   const mappedProperties = await Promise.all(
  //     sensor.properties.map((p) => this.mapper.map(sensor.name, p, this.name)),
  //   );

  //   return new SensorTypeDto(sensor.name, mappedProperties);
  // }
}
