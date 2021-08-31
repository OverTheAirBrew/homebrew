import {
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Sensor, { ISensor } from './sensor';
import { BaseModel } from '../base-model';

export interface ITelemetry {
  id?: string;
  sensor_id: string;
  reading: number;

  sensor?: ISensor;
}

@Table({ modelName: 'telemetry' })
export default class Telemetry extends BaseModel<ITelemetry> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id?: string;

  @Column(DataType.UUID)
  @ForeignKey(() => Sensor)
  sensor_id: string;

  @Column(DataType.DECIMAL(10, 2))
  reading: number;

  @HasOne(() => Sensor, { foreignKey: 'id' })
  sensor?: Sensor;
}
