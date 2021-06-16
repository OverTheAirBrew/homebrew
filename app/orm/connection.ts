import { Sequelize } from 'sequelize';
import * as config from './config';

export const sequelize = new Sequelize(config);
