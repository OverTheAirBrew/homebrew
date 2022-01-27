import { getRepository, Repository } from 'typeorm';
import { startDatabaseConnection } from '../../../src/app/orm/config';
import { Actor } from '../../../src/app/orm/models/actor';
import { Sensor } from '../../../src/app/orm/models/sensor';
import { Telemetry } from '../../../src/app/orm/models/telemetry';

let connected: boolean = false;

export async function clearDatabase() {
  if (!connected) {
    await startDatabaseConnection();
    connected = true;
  }

  const repositories: Record<string, Repository<any>> = {
    sensor: getRepository(Sensor),
    actor: getRepository(Actor),
    telemetry: getRepository(Telemetry),
  };

  await repositories['telemetry'].delete({});
  await repositories['sensor'].delete({});
  await repositories['actor'].delete({});

  return { repositories };
}
