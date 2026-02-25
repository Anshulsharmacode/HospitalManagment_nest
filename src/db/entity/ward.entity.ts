import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bed } from './bed.entity';

export enum WardType {
  ICU = 'ICU',
  GENERAL = 'GENERAL',
  PRIVATE = 'PRIVATE',
  EMERGENCY = 'EMERGENCY',
}

export enum WardChargeType {
  PER_DAY = 'PER_DAY',
  PER_HOUR = 'PER_HOUR',
}

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: WardType })
  wardType: WardType;

  @Column({ type: 'enum', enum: WardChargeType, default: WardChargeType.PER_DAY })
  chargeType: WardChargeType;

  @OneToMany(() => Bed, (bed) => bed.ward)
  beds: Bed[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

