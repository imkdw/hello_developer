import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../entities/user/user.entity';
import { BoardEntity } from '../board/board.entity';

@Entity('BoardRecommend', { name: 'board_recommend' })
export class BoardRecommendEntity {
  @PrimaryGeneratedColumn({ name: 'recommend_id' })
  recommendId: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

  @CreateDateColumn({ type: 'datetime', nullable: true, name: 'created_at_date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'update_at_date' })
  updatedAt: Date;

  @ManyToOne(() => BoardEntity, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
