import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { UtilsService } from '../utils/utils.service';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from './auth.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private emailService: EmailService,
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

    const verifyToken = this.utilsService.getUUID();
    const user = new User();
    user.email = email;
    user.password = await this.utilsService.encrypt(password);
    user.nickname = nickname;
    user.verifyToken = verifyToken;

    const createdUser = await this.userRepository.register(user);

    // TODO: 인증메일 발송 활성화 필요
    // await this.emailService.sendVerifyEmail(email, verifyToken);

    return createdUser.userId;
  }

  /**
   * 로그인
   */
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findUserByEmail(loginDto.email);

    if (!user.isVerified) {
      throw new UnauthorizedException('unauthorized_user');
    }

    const { userId, profileImg, nickname } = user;

    // const jwtConfig = this.configService.get<JwtConfig>('jwt');

    // TODO: 환경변수로 관리필요
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: 'jwtSecret12345!@@!', expiresIn: '1h' },
    );

    // TODO: 환경변수로 관리필요
    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: 'jwtSecret12345!@@!', expiresIn: '10d' },
    );

    await this.userRepository.saveRefreshToken(userId, refreshToken);

    return { userId, profileImg, nickname, accessToken, refreshToken };
  }

  async logout(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.removeRefreshToken(tokenUserId);
  }

  createAccessToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken);
    const token = this.jwtService.sign(
      { userId: decodedToken['userId'] },
      { secret: 'jwtSecret12345!@@!', expiresIn: '1h' },
    );

    console.log(`refreshToken: ${token}`);
    return token;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.utilsService.compare(password, user.password);
    if (!isMatchPassword) return false;

    return true;
  }

  async verify(verifyToken: string) {
    await this.userRepository.verify(verifyToken);
  }

  async verfiyRefreshToken(refreshToken: string) {
    return this.jwtService.verify(refreshToken);
  }

  async check(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      return new BadRequestException('user_mismatch');
    }

    const user = await this.userRepository.findById(userId);
    if (!user.refreshToken) {
      return new UnauthorizedException('not_logged_in');
    }
  }
}
