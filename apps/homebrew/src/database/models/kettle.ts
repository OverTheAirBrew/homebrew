import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Actor } from './actor';
import { Sensor } from './sensor';

@Table({
  modelName: 'kettles',
})
export class Kettle extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column
  name: string;

  @AllowNull
  @ForeignKey(() => Sensor)
  @Column
  sensor_id?: string;

  @AllowNull
  @ForeignKey(() => Actor)
  @Column
  heater_id?: string;

  @AllowNull
  @Column
  logicType_id?: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  config?: any;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
