import { getRepository } from 'typeorm';
import { startDatabaseConnection } from '../../../src/app/orm/config';
import { Actor } from '../../../src/app/orm/models/actor';
import { Sensor } from '../../../src/app/orm/models/sensor';

let connected: boolean = false;

export async function clearDatabase() {
  if (!connected) {
    await startDatabaseConnection();
    connected = true;
  }

  const actorRepository = getRepository(Actor);
  const sensorRepository = getRepository(Sensor);

  await actorRepository.delete({});
  await sensorRepository.delete({});
}
