import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 회원가입
   * @param verifyToken - 이메일 인증용 토큰
   * @param regisetDto - 회원가입 데이터
   */
  async register(verifyToken: string, regisetDto: RegisterDto) {
    const user = new User();
    user.email = regisetDto.email;
    user.password = regisetDto.password;
    user.nickname = regisetDto.nickname;
    user.verifyToken = verifyToken;

    try {
      this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * 이메일로 유저 검색
   * @param email - 사용자 이메일
   * @returns {User}
   */
  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  /**
   * 닉네임으로 유저 검색
   * @param nickname - 사용자 닉네임
   * @returns {User}
   */
  async findUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({ where: { nickname } });
    return user;
  }
}
