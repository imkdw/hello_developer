import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from 'src/users/user.repository';
import { v4 } from 'uuid';
import { PasswordService } from 'src/password/password.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 회원가입
   */
  async register(regisetDto: RegisterDto) {
    const { email, password, nickname } = regisetDto;

    const userByEmail = await this.userRepository.findUserByEmail(email);
    const userByNickname = await this.userRepository.findUserByEmail(nickname);

    if (userByEmail) {
      throw new BadRequestException('exist_email');
    }

    if (userByNickname) {
      throw new BadRequestException('exist_nickname');
    }

    const verifyToken = v4();
    regisetDto.password = await this.passwordService.encrypt(regisetDto.password);

    await this.userRepository.register(verifyToken, regisetDto);
    // TODO: 이메일 발송기능 구현필요
  }

  /**
   * 로그인
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findUserByEmail(email);
    const { userId, profileImg, nickname } = user;

    return {
      userId,
      profileImg,
      nickname,
      accessToken: this.jwtService.sign({ userId }),
      refreshToken: this.jwtService.sign({ userId }, { expiresIn: '10d' }),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.passwordService.compare(password, user.password);
    if (!isMatchPassword) return false;

    return true;
  }
}
