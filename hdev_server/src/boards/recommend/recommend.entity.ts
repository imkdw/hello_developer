import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from '../board.entity';

@Entity({ name: 'board_recommend' })
export class Recommend {
  @PrimaryGeneratedColumn({ name: 'recommend_id' })
  recommendId: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

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

  @ManyToOne(() => Board, (board) => board.recommends)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
