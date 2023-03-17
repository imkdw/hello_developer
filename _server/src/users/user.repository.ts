import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async register(user: User) {
    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

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
}
