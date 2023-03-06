import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BoardEntity } from '../../boards/board/board.entity';
import { UserEntity } from '../../users/user/user.entity';

@Entity('Comment')
export class CommentEntity {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @Column({ type: 'varchar', length: 36, name: 'post_id' })
  postId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 200 })
  content: string;

  @CreateDateColumn({ type: 'datetime', nullable: true, name: 'created_at_date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'update_at_date' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;
}
