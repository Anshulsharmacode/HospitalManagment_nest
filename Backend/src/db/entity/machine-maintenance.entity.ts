import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Machine } from './machine.entity';
import { User } from './user.entity';

export enum MaintenanceStatus {
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('machine_maintenance')
export class MachineMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Machine, (machine) => machine.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  machine: Machine;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  engineer: User;

  @Column({ type: 'text', nullable: true })
  maintenanceLog: string;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt: Date | null;

  @Column({ type: 'int', default: 0 })
  downtimeMinutes: number;

  @Column({ type: 'enum', enum: MaintenanceStatus, default: MaintenanceStatus.REQUESTED })
  status: MaintenanceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

