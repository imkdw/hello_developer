import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Board } from '../board.entity';
import { Tag } from '../tag/tag.entity';

@Entity('BoardTag', { name: 'board_tags' })
export class BoardTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @Column({ type: 'int', name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => Board, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  boards: Board;

  @ManyToOne(() => Tag, (tags) => tags.tagId)
  @JoinColumn({ name: 'tag_id' })
  tags: Tag;
}
