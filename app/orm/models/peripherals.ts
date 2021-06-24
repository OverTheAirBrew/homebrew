import { Column, Table, DataType, PrimaryKey } from 'sequelize-typescript';
import { BaseModel } from '../base-model';
import { sequelize } from '../connection';

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

@Table({ modelName: 'peripherals' })
export default class Peripheral extends BaseModel<IPeripheral> {
  @PrimaryKey
  @Column(DataType.UUID)
  // @Default(DataType.UUIDV4)
  id?: string;

  @Column(DataType.STRING) name: string;
  @Column(DataType.ENUM('heater')) type: PeripheralType;
  @Column(DataType.ENUM('gpio')) communicationType: PeripheralCommunicationType;
  @Column(DataType.INTEGER) gpio?: number;
  @Column(DataType.DATE) createdAt?: Date;
  @Column(DataType.DATE) updatedAt?: Date;
}
