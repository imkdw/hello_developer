import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "tags" })
export default class Tag {
  @PrimaryGeneratedColumn({ name: "tag_id" })
  tagId: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;
}
