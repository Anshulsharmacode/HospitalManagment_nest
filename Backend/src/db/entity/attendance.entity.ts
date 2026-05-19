import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  employee: User;

  @Column({ type: 'timestamptz' })
  loginTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  logoutTime: Date | null;

  @Column({ nullable: true })
  shiftName: string;

  @CreateDateColumn()
  createdAt: Date;
}
