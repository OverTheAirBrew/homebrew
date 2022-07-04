import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface IDevice {}

@Table({
  modelName: 'devices',
})
export class Device extends Model<IDevice, IDevice> {
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
  config: any;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
