import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';

export enum InvoiceStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Admission, (admission) => admission.invoice, { onDelete: 'RESTRICT' })
  @JoinColumn()
  admission: Admission;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  finalAmount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  advancePayment: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  insuranceCoveragePercent: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  refundAmount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  creditNoteAmount: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
