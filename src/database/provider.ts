import { homedir } from 'os';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: join(homedir(), 'ota.homebrew.db'),
        models: [join(__dirname, 'models', '*.js')],
        logging: false,
      });
      await sequelize.sync({
        alter: true,
      });
      return sequelize;
    },
  },
];
