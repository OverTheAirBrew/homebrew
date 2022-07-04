import {
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

@Table({
  modelName: 'actors',
})
export class Actor extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column
  @ForeignKey(() => Device)
  device_id: string;

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

  @HasMany(() => Kettle)
  kettles: Kettle[];
}
