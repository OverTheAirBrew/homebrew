import Peripheral from '../../../src/orm/models/peripherals';

export async function cleanup() {
  await Peripheral.destroy({ where: {} });
}
