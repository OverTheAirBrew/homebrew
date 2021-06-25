import Peripheral from '../../../orm/models/peripherals';

export async function cleanup() {
  await Peripheral.destroy({ where: {} });
}
