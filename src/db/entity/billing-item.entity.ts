import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';
import { ChargeItem } from './charge-item.entity';
import { Patient } from './patient.entity';

export enum BillingItemStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentMode {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  INSURANCE = 'INSURANCE',
}

@Entity('billing_items')
export class BillingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.billingItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  patient: Patient;

  @ManyToOne(() => Admission, (admission) => admission.billingItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  admission: Admission;

  @ManyToOne(() => ChargeItem, (chargeItem) => chargeItem.billingItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  chargeItem: ChargeItem;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1 })
  quantity: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: string;

  @Column({ type: 'enum', enum: BillingItemStatus, default: BillingItemStatus.PENDING })
  status: BillingItemStatus;

  @Column({ type: 'enum', enum: PaymentMode, nullable: true })
  paymentMode: PaymentMode | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

