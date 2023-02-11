import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn({ name: "category_id" })
  categoryId: number;

  @Column({ name: "category_name", type: "varchar", length: 255 })
  categoryName: string;
}
