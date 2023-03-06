import { Column, Entity, JoinColumn, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { BoardEntity } from '../board/board.entity';
import { TagEntity } from './tag.entity';

@Entity('BoardTag', { name: 'board_tags' })
export class BoardTagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @Column({ type: 'int', name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => BoardEntity, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  boards: BoardEntity;

  @ManyToOne(() => TagEntity, (tags) => tags.tagId)
  @JoinColumn({ name: 'tag_id' })
  tags: TagEntity;
}
