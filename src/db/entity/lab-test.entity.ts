import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';
import { Patient } from './patient.entity';
import { User } from './user.entity';

export enum LabTestStatus {
  PENDING = 'PENDING',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
}

@Entity('lab_tests')
export class LabTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testName: string;

  @ManyToOne(() => Patient, (patient) => patient.labTests, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  patient: Patient;

  @ManyToOne(() => Admission, (admission) => admission.labTests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  admission: Admission | null;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  requestedByDoctor: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  technician: User | null;

  @Column({ type: 'enum', enum: LabTestStatus, default: LabTestStatus.PENDING })
  status: LabTestStatus;

  @Column({ nullable: true })
  reportUrl: string;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

