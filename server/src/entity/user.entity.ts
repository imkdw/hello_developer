import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId: string;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 255, default: "", nullable: true })
  introduce: string;

  @Column({ type: "varchar", length: 255, name: "profile_img", default: "", nullable: true })
  profileImage: string;

  @CreateDateColumn({ type: "datetime", name: "created_at_date", nullable: true })
  createdAt: Date;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  nickname: string;

  @Column({ type: "boolean", name: "is_auth_flag", default: false, nullable: true })
  isAuth: boolean;
}
