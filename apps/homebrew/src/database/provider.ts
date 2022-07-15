import { homedir } from 'os';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Actor } from './models/actor';
import { Sensor } from './models/sensor';
import { Telemetry } from './models/telemetry';

import { SequelizeStorage, Umzug } from 'umzug';
import { Device } from './models/device';
import { Kettle } from './models/kettle';

const HOME_DIR = process.env.HOME_DIR || homedir();

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(HOME_DIR, 'ota.homebrew.db'),
  models: [Actor, Sensor, Telemetry, Kettle, Device],
  logging: false,
  define: {
    timestamps: true,
  },
});

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      if (process.env.CI !== 'true') {
        await migrateDatabase(sequelize);
      }

      return sequelize;
    },
  },
];

export async function migrateDatabase(sequelize: Sequelize) {
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
