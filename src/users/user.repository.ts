import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  /**
   * user 테이블에 회원정보 삽입 쿼리
   * @param user
   * @returns 생성된 유저정보 반환
   */
  async register(user: User) {
    return await this.userRepository.save(user);
  }

  /**
   * 이메일을 기준으로 유저를 검색하는 쿼리
   * @param email
   * @returns 유저정보가 있을경우 반환, 없을경우 null
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * 닉네임을 기준으로 유저를 검색하는 쿼리
   * @param email
   * @returns 유저정보가 있을경우 반환, 없을경우 null
   */
  async findUserByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async profile(userId: string): Promise<User | null> {
    const profile = await this.userRepository.findOne({
      where: { userId },
      select: ['nickname', 'introduce', 'profileImg'],
    });

    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    const { nickname, introduce } = updateProfileDto;
    await this.userRepository.update(userId, { nickname, introduce });
  }

  async remove(userId: string) {
    await this.userRepository.delete({ userId });
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: string) {
    await this.userRepository.update(userId, { refreshToken: '' });
  }

  async findById(userId: string) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async verify(verifyToken: string) {
    await this.userRepository.update({ verifyToken }, { isVerified: true });
  }

  async updatePassword(userId: string, password: string) {
    await this.userRepository.update({ userId }, { password });
  }

  async profileImage(userId: string, imageUrl: string) {
    await this.userRepository.update({ userId }, { profileImg: imageUrl });
  }
}
