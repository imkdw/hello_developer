import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { JoinTable } from 'typeorm/decorator/relations/JoinTable';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { BoardsEntity } from './boards.entity';

@Entity('Tags')
export class TagsEntity {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToMany(() => BoardsEntity, (board) => board.boardId)
  @JoinTable({
    name: 'board_tags',
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'board_id',
    },
  })
  boards: BoardsEntity[];
}

@Entity('BoardTags', { name: 'board_tags' })
export class BoardTagsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  boardId: string;

  @Column({ type: 'int' })
  tagId: number;

  @ManyToOne(() => BoardsEntity, (board) => board.boardId)
  boards: BoardsEntity;

  @ManyToOne(() => TagsEntity, (tags) => tags.tagId)
  tags: TagsEntity;
}
