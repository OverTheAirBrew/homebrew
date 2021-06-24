import Peripheral from '../../../app/orm/models/peripherals';

export async function cleanup() {
  await Peripheral.destroy({ where: {} });
}
