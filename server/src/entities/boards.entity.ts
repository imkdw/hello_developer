import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Board')
export class BoardsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'board_id' })
  boardId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

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

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

// CREATE TABLE `post` (
//   `category_id1` int DEFAULT NULL,
//   `category_id2` int DEFAULT NULL,
//   `recommend_cnt` int DEFAULT '0',
//   PRIMARY KEY (`post_id`),
//   KEY `category_id1` (`category_id1`),
//   KEY `category_id2` (`category_id2`),
//   CONSTRAINT `post_ibfk_2` FOREIGN KEY (`category_id1`) REFERENCES `post_category` (`category_id`),
//   CONSTRAINT `post_ibfk_3` FOREIGN KEY (`category_id2`) REFERENCES `post_category` (`category_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
