import {
  Column,
  Table,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from '../base-model';

export type PeripheralCommunicationType = 'gpio';
export type PeripheralType = 'heater';

export interface IPeripheral {
  id?: string;
  name: string;
  type: PeripheralType;
  communicationType: PeripheralCommunicationType;
  config?: any;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Table({ modelName: 'peripherals' })
export default class Peripheral extends BaseModel<IPeripheral> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column(DataType.STRING) name: string;
  @Column(DataType.ENUM('heater')) type: PeripheralType;
  @Column(DataType.ENUM('gpio')) communicationType: PeripheralCommunicationType;
  @Column(DataType.JSON) config: string;
  @Column(DataType.DATE) createdAt?: Date;
  @Column(DataType.DATE) updatedAt?: Date;
}
