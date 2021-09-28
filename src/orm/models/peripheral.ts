import {
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../base-model';

export interface IPeripheral {
  id?: string;
  name: string;
  type_id: string;
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

  @Column(DataType.STRING)
  type_id: string;

  @Column(DataType.JSON) config: string;
  @Column(DataType.DATE) createdAt?: Date;
  @Column(DataType.DATE) updatedAt?: Date;
}
