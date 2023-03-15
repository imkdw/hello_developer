import { Board } from '../boards/board.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 200 })
  comment: string;

  @CreateDateColumn({
    type: 'datetime',
    nullable: true,
    name: 'created_at_date',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
    name: 'update_at_date',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.comments)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
