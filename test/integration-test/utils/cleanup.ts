import Peripheral from '../../../src/orm/models/peripheral';

export async function cleanup() {
  await Peripheral.destroy({ where: {} });
}
