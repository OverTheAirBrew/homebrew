import {
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
import Sensor from './sensor';

@Table({
  modelName: 'telemetries',
})
export class Telemetry extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column
  @ForeignKey(() => Sensor)
  sensor_id: string;

  @BelongsTo(() => Sensor)
  sensor: Sensor;

  @Column
  reading: number;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
