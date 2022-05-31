import { homedir } from 'os';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Actor } from './models/actor';
import { Sensor } from './models/sensor';
import { Telemetry } from './models/telemetry';

import { SequelizeStorage, Umzug } from 'umzug';
import { Kettle } from './models/kettle';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: join(homedir(), 'ota.homebrew.db'),
        models: [Actor, Sensor, Telemetry, Kettle],
        // logging: false,
      });

      await migrateDatabase(sequelize);

      return sequelize;
    },
  },
];

async function migrateDatabase(sequelize: Sequelize) {
  const umzug = new Umzug({
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize,
    }),
    migrations: {
      glob: '**/migrations/*.js',
    },
    logger: console,
  });

  await umzug.up();
}
