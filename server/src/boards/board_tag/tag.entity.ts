import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { JoinTable } from 'typeorm/decorator/relations/JoinTable';
import { BoardEntity } from '../board/board.entity';

@Entity('Tag')
export class TagEntity {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToMany(() => BoardEntity, (board) => board.boardId)
  @JoinTable({
    name: 'board_tags',
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'board_id',
    },
  })
  boards: BoardEntity[];
}
