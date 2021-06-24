import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import * as config from './config';

export const sequelize = new Sequelize({
  ...config,
  models: [join(__dirname, 'models', '**/*.js')],
});
