import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>,
  ) {}

  async createUser(user: UsersEntity) {
    await this.repository.save(user);
  }

  async findUserByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  async findUserByNickname(nickname: string) {
    return await this.repository.findOne({ where: { nickname } });
  }
}
