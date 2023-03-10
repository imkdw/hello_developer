import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../board.entity';

@Entity('Tag')
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToMany(() => Board, (board) => board.tags)
  boards: Board[];
}
