import { SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../lib/logger';

export const BASE_CONFIG: Partial<SequelizeOptions> = {
  dialect: 'sqlite',
  logging: (msg: string) => logger.debug(msg),
  define: {
    timestamps: true,
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
  repositoryMode: true,
};
