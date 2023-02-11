import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import Tag from "./tag.entity";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn("uuid", { name: "post_id" })
  postId: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @CreateDateColumn({ type: "datetime", name: "created_at_date", nullable: true })
  createdAt: Date;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "int", name: "recommend_cnt", nullable: true })
  recommendCount: number;

  @Column({ type: "int", name: "non_recommend_cnt", nullable: true })
  nonRecommendCount: number;

  /** 다대다 관계 표현 */
  @ManyToMany(() => Tag)
  @JoinTable({
    name: "post_tags",
    joinColumn: { name: "post_id", referencedColumnName: "postId" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "tagId" },
  })
  tags: Tag[];
}
