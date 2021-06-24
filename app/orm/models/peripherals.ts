import { BaseModel } from './base-model';
import { sequelize } from '../connection';
import { DataTypes } from 'sequelize';
import { Service } from 'typedi';

export type PeripheralCommunicationType = 'gpio';
export type PeripheralType = 'heater';

export interface IPeripheral {
  id?: string;
  name: string;
  type: PeripheralType;
  communicationType: PeripheralCommunicationType;
  gpio?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Service()
export class Peripheral extends BaseModel<IPeripheral> {
  public id?: string;
  public name: string;
  public type: 'heater';
  public communicationType: 'gpio';
  public gpio?: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

Peripheral.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('heater'),
      allowNull: false,
    },
    communicationType: {
      type: DataTypes.ENUM('gpio'),
      allowNull: false,
    },
    gpio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'peripherals',
    sequelize,
  },
);
