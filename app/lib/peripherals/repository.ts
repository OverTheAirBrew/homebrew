import {
  IPeripheral,
  Peripheral,
  PeripheralCommunicationType,
  PeripheralType,
} from '../../orm/models/peripherals';
import { PeripheralNotFoundError } from '../errors/peripheral-not-found';

export async function createPeripheral(peripheral: {
  name: string;
  type: string;
  communicationType: string;
  gpio?: number;
}): Promise<string> {
  const createdPeripheral = await Peripheral.create({
    ...peripheral,
    communicationType:
      peripheral.communicationType as PeripheralCommunicationType,
    type: peripheral.type as PeripheralType,
  });
  return createdPeripheral.id;
}

export async function getPeripheralsOfType(type: PeripheralType) {
  const peripherals = await Peripheral.findAll({
    where: {
      type,
    },
  });

  return peripherals.map((peripheral) => peripheral.toJSON());
}

export async function getPeripheralByTypeAndId(
  type: PeripheralType,
  id: string,
) {
  const peripheral = await Peripheral.findOne({
    where: {
      type,
      id,
    },
  });

  if (!peripheral) {
    throw new PeripheralNotFoundError(type, id);
  }

  return peripheral.toJSON();
}
