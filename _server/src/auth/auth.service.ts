import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from '../password/password.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 회원가입
   */
  async register(registerDto: RegisterDto) {
    registerDto.password = await this.passwordService.encrypt(registerDto.password);
    await this.usersService.register(registerDto);
    // TODO: 이메일 발송기능 구현필요
  }

  /**
   * 로그인
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    // TODO: 테스트로 인해 인증여부 비활성화, 추후 해제필요
    // if (!user.isVerified) {
    //   throw new UnauthorizedException('unauthorized_user');
    // }

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
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.passwordService.compare(password, user.password);
    if (!isMatchPassword) return false;

    return true;
  }
}
