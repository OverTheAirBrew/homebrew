import { join } from 'path';
import { logger } from '../lib/logger';

export const dialect = 'sqlite';
export const storage = join(__dirname, '..', 'ota.db');

export const logging = (msg: string) => logger.debug(msg);

export const define = {
  timestamps: true,
};

export const dialectOptions = {
  charset: 'utf8mb4',
};
