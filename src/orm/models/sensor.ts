import {
  Column,
  Table,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

import { BaseModel } from '../base-model';

export interface ISensor {
  id?: string;
  name: string;
  type_id: string;
  config: any;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

@Table({ modelName: 'sensors' })
export default class Sensor extends BaseModel<ISensor> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column(DataType.STRING) name: string;

  @Column(DataType.STRING)
  type_id: string;

  @Column(DataType.JSON) config: any;
  @Column(DataType.DATE) createdAt?: Date;
  @Column(DataType.DATE) updatedAt?: Date;
}
