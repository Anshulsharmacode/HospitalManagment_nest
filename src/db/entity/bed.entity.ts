import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';
import { Ward } from './ward.entity';

export enum BedStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('beds')
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bedNumber: string;

  @Column({ type: 'enum', enum: BedStatus, default: BedStatus.VACANT })
  status: BedStatus;

  @ManyToOne(() => Ward, (ward) => ward.beds, { nullable: false, onDelete: 'RESTRICT' })
  ward: Ward;

  @OneToMany(() => Admission, (admission) => admission.bed)
  admissions: Admission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

