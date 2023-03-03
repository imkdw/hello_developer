import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  // IETF 이메일 주소 규격에 따라 320자로 제한
  @Column('varchar', { length: 320, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('char', { length: 8, nullable: false, unique: true })
  nickname: string;

  @Column('varchar', { length: 255, nullable: true, default: '' })
  introduce: string;

  // TODO: 유저 프로필 이미지 기본값 변경하기
  @Column('varchar', {
    length: 255,
    nullable: true,
    default:
      'https://item.kakaocdn.net/do/60186e0074ad046dc11b946556106b479f17e489affba0627eb1eb39695f93dd',
    name: 'profile_img',
  })
  profileImg: string;

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

  @Column('boolean', {
    nullable: true,
    default: false,
    name: 'is_verified_flag',
  })
  isVerified: boolean;

  @Column('varchar', { length: 255, nullable: false, name: 'verify_token' })
  verifyToken: string;
}
