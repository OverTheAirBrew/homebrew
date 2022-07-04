import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Device } from './device';
import { Kettle } from './kettle';
import { Telemetry } from './telemetry';

@Table({
  modelName: 'sensors',
})
export class Sensor extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column
  @ForeignKey(() => Device)
  device_id: string;

  @BelongsTo(() => Device)
  device: Device;

  @Column
  name: string;

  @Column
  type_id: string;

  @Column({
    type: DataType.JSON,
  })
  config: any;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  @HasMany(() => Telemetry)
  telemetries: Telemetry[];

  @HasMany(() => Kettle)
  kettles: Kettle[];
}
