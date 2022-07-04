import {
  AllowNull,
  BelongsTo,
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

  @AllowNull
  @Column
  logicRun_id: string;

  @AllowNull
  @Column
  targetTemperature: number;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  @BelongsTo(() => Actor, { foreignKey: 'heater_id' })
  heater?: Actor;

  @BelongsTo(() => Sensor, { foreignKey: 'sensor_id' })
  sensor?: Sensor;
}
