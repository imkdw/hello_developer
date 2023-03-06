import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from '../board/board.entity';

@Entity({ name: 'board_category' })
export class BoardCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string | null;

  @OneToMany(() => BoardEntity, (board) => board.category1)
  boards1: BoardEntity;

  @OneToMany(() => BoardEntity, (board) => board.category2)
  boards2: BoardEntity;
}

export const defaultCategorys: Partial<BoardCategoryEntity>[] = [
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
