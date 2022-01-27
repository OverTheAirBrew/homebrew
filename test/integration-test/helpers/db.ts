import { getRepository, Repository } from 'typeorm';
import { startDatabaseConnection } from '../../../src/app/orm/config';
import { Actor } from '../../../src/app/orm/models/actor';
import { Kettle } from '../../../src/app/orm/models/kettle';
import { Sensor } from '../../../src/app/orm/models/sensor';
import { Telemetry } from '../../../src/app/orm/models/telemetry';

let connected: boolean = false;

export interface IDbRepositories {
  sensor: Repository<Sensor>;
  actor: Repository<Actor>;
  telemetry: Repository<Telemetry>;
  kettle: Repository<Kettle>;
}

export async function clearDatabase() {
  if (!connected) {
    await startDatabaseConnection();
    connected = true;
  }

  const repositories: IDbRepositories = {
    sensor: getRepository(Sensor),
    actor: getRepository(Actor),
    telemetry: getRepository(Telemetry),
    kettle: getRepository(Kettle),
  };

  await repositories.telemetry.delete({});
  await repositories.kettle.delete({});
  await repositories.sensor.delete({});
  await repositories.actor.delete({});

  return repositories;
}
