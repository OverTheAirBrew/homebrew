import { SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../lib/utils/logger';

export const BASE_CONFIG: Partial<SequelizeOptions> = {
  logging: (msg: string) => logger.debug(msg),
  define: {
    timestamps: true,
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
  repositoryMode: true,
};
