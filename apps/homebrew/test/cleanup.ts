import { TestingModule } from '@nestjs/testing';
import { Actor } from '../src/database/models/actor';
import { Kettle } from '../src/database/models/kettle';
import { Sensor } from '../src/database/models/sensor';
import { Telemetry } from '../src/database/models/telemetry';
import {
  ActorRepository,
  KettleRepository,
  SensorRepository,
  TelemetryRepository,
} from '../src/lib/constants';

export interface IRepositories {
  sensors: typeof Sensor;
  actors: typeof Actor;
  kettles: typeof Kettle;
  telemetry: typeof Telemetry;
}

export async function cleanup(module: TestingModule) {
  const databases: IRepositories = {
    kettles: module.get(KettleRepository),
    telemetry: module.get(TelemetryRepository),
    actors: module.get(ActorRepository),
    sensors: module.get(SensorRepository),
  };

  for (const database of Object.keys(databases)) {
    await databases[database].destroy({ where: {} });
  }

  return databases;
}
