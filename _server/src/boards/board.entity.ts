import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Category } from './category/category.entity';
import { Tag } from './tag/tag.entity';
import { View } from './view/view.entity';
import { Comment } from '../comments/comment.entity';
import { Recommend } from './recommend/recommend.entity';

@Entity('Board')
export class Board {
  @PrimaryGeneratedColumn('uuid', { name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 255, name: 'temp_board_id' })
  tempBoardId: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', name: 'category_id1' })
  categoryId1: number;

  @Column({ type: 'int', name: 'category_id2', nullable: true })
  categoryId2: number | null;

  @CreateDateColumn({
    type: 'datetime',
    nullable: true,
    name: 'created_at_date',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
    name: 'update_at_date',
  })
  updatedAt: Date;

  @Column({ type: 'int', default: 0, nullable: true, name: 'recommend_cnt' })
  recommendCnt: number;

  @ManyToOne(() => User, (user) => user.board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.boards1)
  @JoinColumn({ name: 'category_id1' })
  category1: Category;

  @ManyToOne(() => Category, (category) => category.boards2)
  @JoinColumn({ name: 'category_id2' })
  category2: Category;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];

  @OneToOne(() => View, (view) => view.board)
  view: View;

  @ManyToMany(() => Tag, (tag) => tag.boards, { cascade: true })
  @JoinTable({
    name: 'board_tag',
    joinColumn: { name: 'board_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @OneToMany(() => Recommend, (recommend) => recommend.board)
  recommends: Recommend[];
}
