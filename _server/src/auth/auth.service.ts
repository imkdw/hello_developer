import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private userRepository: UserRepository,
  ) {}

  /**
   * 회원가입
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    if (await this.userRepository.findUserByEmail(email))
      throw new BadRequestException('exist_email');
    if (await this.userRepository.findUserByNickname(nickname))
      throw new BadRequestException('exist_nickname');

    const user = new User();
    user.email = email;
    user.password = await this.utilsService.encrypt(password);
    user.nickname = nickname;
    user.verifyToken = await this.utilsService.getUUID();

    const createdUser = await this.userRepository.register(user);
    return createdUser.userId;

    // TODO: 이메일 발송기능 구현필요
  }

  /**
   * 로그인
   */
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findUserByEmail(loginDto.email);

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
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.utilsService.compare(password, user.password);
    if (!isMatchPassword) return false;

    return true;
  }
}
