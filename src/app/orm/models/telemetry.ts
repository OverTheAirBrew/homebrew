import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sensor } from './sensor';

@Entity()
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @OneToOne(() => Sensor)
  sensor_id: string;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
