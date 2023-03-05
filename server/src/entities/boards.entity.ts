import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BoardsCategoryEntity } from './boards-category.entity';
import { TagsEntity } from './tags.entity';
import { UsersEntity } from './users.entity';

@Entity('Board')
export class BoardsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', name: 'category_id1' })
  categoryId1: number;

  @Column({ type: 'int', name: 'category_id2' })
  categoryId2: number | null;

  @CreateDateColumn({ type: 'datetime', nullable: true, name: 'created_at_date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'update_at_date' })
  updatedAt: Date;

  @Column({ type: 'int', default: 0, nullable: true, name: 'recommend_cnt' })
  recommendCnt: number;

  @ManyToOne(() => UsersEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => BoardsCategoryEntity, (boardCategory) => boardCategory.categoryId)
  @JoinColumn({ name: 'category_id1' })
  category1: BoardsCategoryEntity;

  @ManyToOne(() => BoardsCategoryEntity, (boardCategory) => boardCategory.categoryId)
  @JoinColumn({ name: 'category_id2' })
  category2: BoardsCategoryEntity;

  @ManyToMany(() => TagsEntity, (tags) => tags.tagId)
  @JoinTable({
    name: 'board_tags',
    joinColumn: {
      name: 'board_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  tags: TagsEntity[];
}
