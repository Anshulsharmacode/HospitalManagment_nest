import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_threads')
export class ChatThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-array' })
  participantIds: string[];

  @OneToMany(() => ChatMessage, (message) => message.thread)
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

