import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatThread } from './chat-thread.entity';
import { User } from './user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatThread, (thread) => thread.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  thread: ChatThread;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  sender: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  receiver: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

