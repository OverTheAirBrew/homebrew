import { join } from 'path';
import Peripheral from '../../../src/orm/models/peripheral';
import Sensor from '../../../src/orm/models/sensor';
import Telemetry from '../../../src/orm/models/telemetry';
import { SequelizeWrapper } from '../../../src/orm/sequelize-wrapper';

export async function cleanup() {
  const wrapper = new SequelizeWrapper({
    dialect: 'mysql',
    url: process.env.DB_URL || 'mysql://root:@localhost/homebrew',
    cwd: join(__dirname, '..', '..', '..', 'src', 'orm'),
  });

  await wrapper.sequelize.getRepository(Telemetry).destroy({ where: {} });
  await wrapper.sequelize.getRepository(Peripheral).destroy({ where: {} });
  await wrapper.sequelize.getRepository(Sensor).destroy({ where: {} });

  return wrapper;
}
