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
export class Kettle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @OneToOne(() => Sensor)
  sensor_id: string;

  // @Column()
  // @OneToOne(() => )
  // heater_id: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
