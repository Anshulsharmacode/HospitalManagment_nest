import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingItem } from './billing-item.entity';
import { ChargeCategory } from './charge-category.entity';

export enum ChargeType {
  PER_DAY = 'PER_DAY',
  FIXED = 'FIXED',
  PER_TEST = 'PER_TEST',
}

@Entity('charge_items')
export class ChargeItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ChargeCategory, (category) => category.items, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  category: ChargeCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'enum', enum: ChargeType })
  chargeType: ChargeType;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => BillingItem, (billingItem) => billingItem.chargeItem)
  billingItems: BillingItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

