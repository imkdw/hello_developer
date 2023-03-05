import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardsEntity } from './boards.entity';

@Entity({ name: 'board_category' })
export class BoardsCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string | null;

  @OneToMany(() => BoardsEntity, (board) => board.category1)
  boards1: BoardsEntity;

  @OneToMany(() => BoardsEntity, (board) => board.category2)
  boards2: BoardsEntity;
}

export const defaultCategorys: Partial<BoardsCategoryEntity>[] = [
  { categoryId: 1, name: 'notice' },
  { categoryId: 2, name: 'suggestion' },
  { categoryId: 3, name: 'free' },
  { categoryId: 4, name: 'knowledge' },
  { categoryId: 5, name: 'tips' },
  { categoryId: 6, name: 'review' },
  { categoryId: 7, name: 'qna' },
  { categoryId: 8, name: 'tech' },
  { categoryId: 9, name: 'career' },
  { categoryId: 10, name: 'recruitment' },
  { categoryId: 11, name: 'project' },
  { categoryId: 12, name: 'study' },
  { categoryId: 13, name: 'company' },
];
