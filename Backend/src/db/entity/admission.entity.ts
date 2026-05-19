import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bed } from './bed.entity';
import { BillingItem } from './billing-item.entity';
import { Invoice } from './invoice.entity';
import { LabTest } from './lab-test.entity';
import { Patient } from './patient.entity';

export enum AdmissionStatus {
  ACTIVE = 'ACTIVE',
  DISCHARGED = 'DISCHARGED',
}

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.admissions, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  patient: Patient;

  @ManyToOne(() => Bed, (bed) => bed.admissions, { nullable: false, onDelete: 'RESTRICT' })
  bed: Bed;

  @Column({ type: 'timestamptz' })
  admissionDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  dischargeDate: Date | null;

  @Column({ type: 'enum', enum: AdmissionStatus, default: AdmissionStatus.ACTIVE })
  status: AdmissionStatus;

  @OneToMany(() => BillingItem, (billingItem) => billingItem.admission)
  billingItems: BillingItem[];

  @OneToMany(() => LabTest, (labTest) => labTest.admission)
  labTests: LabTest[];

  @OneToOne(() => Invoice, (invoice) => invoice.admission)
  invoice: Invoice;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
