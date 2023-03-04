import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Board')
export class BoardsCategoryEntity {
  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string;
}

// CREATE TABLE `post_category` (
//   `category_id` int NOT NULL AUTO_INCREMENT,
//   `name` varchar(255) NOT NULL,
//   PRIMARY KEY (`category_id`)
// )
