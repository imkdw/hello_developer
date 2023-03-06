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
import { BoardCategoryEntity } from '../board_category/board-category.entity';
import { UserEntity } from '../../entities/user/user.entity';
import { TagEntity } from '../board_tag/tag.entity';

@Entity('Board')
export class BoardEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BoardCategoryEntity, (boardCategory) => boardCategory.categoryId)
  @JoinColumn({ name: 'category_id1' })
  category1: BoardCategoryEntity;

  @ManyToOne(() => BoardCategoryEntity, (boardCategory) => boardCategory.categoryId)
  @JoinColumn({ name: 'category_id2' })
  category2: BoardCategoryEntity;

  @ManyToMany(() => TagEntity, (tags) => tags.tagId)
  @JoinTable({
    name: 'board_tags',
    joinColumn: {
      name: 'board_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  tags: TagEntity[];
}
