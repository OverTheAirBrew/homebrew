import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Actor } from './actor';
import { Sensor } from './sensor';

@Entity()
export class Kettle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Sensor)
  @JoinColumn({ name: 'sensor_id' })
  sensor?: Sensor;

  @ManyToOne(() => Actor)
  @JoinColumn({ name: 'heater_id' })
  heater?: Actor;

  @Column({
    nullable: true,
  })
  logicType_id?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  config?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
