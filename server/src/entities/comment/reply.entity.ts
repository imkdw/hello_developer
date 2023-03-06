import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Entity('reply')
export class ReplyEntity {
  @PrimaryGeneratedColumn({ name: 'reply_id' })
  replyId: number;

  @Column({ type: 'int', name: 'comment_id' })
  commentId: number;

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

  @ManyToOne(() => CommentEntity, (comment) => comment.commentId)
  @JoinColumn({ name: 'commend_id' })
  comment: CommentEntity;
}
