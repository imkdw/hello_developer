import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async createUser(user: UserEntity) {
    await this.repository.save(user);
  }

  async findUserByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  async findUserByNickname(nickname: string) {
    return await this.repository.findOne({ where: { nickname } });
  }
}
