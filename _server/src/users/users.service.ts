import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 회원가입
   * @param registerDto - 회원가입 데이터
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    if (await this.findUserByEmail(email)) throw new BadRequestException('exist_email');
    if (await this.findUserByNickname(nickname)) throw new BadRequestException('exist_nickname');

    const verifyToken = v4();

    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.verifyToken = verifyToken;

    await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { nickname } });
  }
}
