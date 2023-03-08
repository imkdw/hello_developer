import {
  Column,
  Entity,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinTable } from 'typeorm/decorator/relations/JoinTable';
import { Board } from '../board.entity';

@Entity('Tag')
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToMany((type) => Board, (board) => board.tags)
  boards: Board[];
}
