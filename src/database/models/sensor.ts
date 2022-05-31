import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
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
  name: string;

  @Column
  type_id: string;

  @Column({
    type: DataType.JSON,
  })
  config: string;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  @HasMany(() => Telemetry)
  telemetries: Telemetry;
}
