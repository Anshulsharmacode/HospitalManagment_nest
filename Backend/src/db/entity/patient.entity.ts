import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';
import { Appointment } from './appointment.entity';
import { BillingItem } from './billing-item.entity';
import { LabTest } from './lab-test.entity';

export enum PatientState {
  REGISTERED = 'REGISTERED',
  APPOINTMENT_SCHEDULED = 'APPOINTMENT_SCHEDULED',
  ADMITTED = 'ADMITTED',
  UNDER_TREATMENT = 'UNDER_TREATMENT',
  DISCHARGED = 'DISCHARGED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ type: 'jsonb', nullable: true })
  insuranceDetails: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'enum', enum: PatientState, default: PatientState.REGISTERED })
  state: PatientState;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Admission, (admission) => admission.patient)
  admissions: Admission[];

  @OneToMany(() => BillingItem, (billingItem) => billingItem.patient)
  billingItems: BillingItem[];

  @OneToMany(() => LabTest, (labTest) => labTest.patient)
  labTests: LabTest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
