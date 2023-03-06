import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BoardEntity } from '../../boards/board/board.entity';
import { UserEntity } from './user.entity';

@Entity('Bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn({ name: 'bookmark_id' })
  bookmarkId: number;

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
