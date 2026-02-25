import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { MachineMaintenance } from './machine-maintenance.entity';

export enum MachineStatus {
  OPERATIONAL = 'OPERATIONAL',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  machineName: string;

  @ManyToOne(() => Department, { nullable: false, onDelete: 'RESTRICT' })
  department: Department;

  @Column({ type: 'enum', enum: MachineStatus, default: MachineStatus.OPERATIONAL })
  status: MachineStatus;

  @Column({ type: 'date', nullable: true })
  lastServiced: string;

  @OneToMany(() => MachineMaintenance, (maintenance) => maintenance.machine)
  maintenances: MachineMaintenance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

