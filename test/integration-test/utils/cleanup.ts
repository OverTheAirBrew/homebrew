import { join } from 'path';
import Sensor from '../../../src/orm/models/sensor';
import { SequelizeWrapper } from '../../../src/orm/sequelize-wrapper';

export async function cleanup() {
  const { sequelize } = new SequelizeWrapper({
    dialect: 'mysql',
    url: process.env.DB_URL || 'mysql://root:@localhost/homebrew',
    cwd: join(__dirname, '..', '..', '..', 'src', 'orm'),
  });

  // await sequelize.getRepository(Peripheral).destroy({ where: {} });
  await sequelize.getRepository(Sensor).destroy({ where: {} });

  return sequelize;
}
