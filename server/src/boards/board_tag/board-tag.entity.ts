import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { BoardEntity } from '../board/board.entity';
import { TagEntity } from './tag.entity';

@Entity('BoardTag', { name: 'board_tags' })
export class BoardTagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  boardId: string;

  @Column({ type: 'int' })
  tagId: number;

  @ManyToOne(() => BoardEntity, (board) => board.boardId)
  boards: BoardEntity;

  @ManyToOne(() => TagEntity, (tags) => tags.tagId)
  tags: TagEntity;
}
