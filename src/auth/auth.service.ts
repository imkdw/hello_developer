import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { UtilsService } from '../utils/utils.service';
import { ConfigService } from '@nestjs/config';
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

  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    if (await this.userRepository.findUserByEmail(email)) {
      throw new BadRequestException('exist_email');
    }

    if (await this.userRepository.findUserByNickname(nickname)) {
      throw new BadRequestException('exist_nickname');
    }

    const verifyToken = this.utilsService.getUUID();

    const user = new User();
    user.email = email;
    user.password = await this.utilsService.encrypt(password);
    user.nickname = nickname;
    user.verifyToken = verifyToken;

    const createdUser = await this.userRepository.register(user);

    await this.emailService.sendVerifyEmail(email, verifyToken);

    return createdUser.userId;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findUserByEmail(loginDto.email);

    if (!user.isVerified) {
      throw new UnauthorizedException('unauthorized_user');
    }

    const { userId, profileImg, nickname } = user;

    const accessToken = this.createAccessToken(userId);
    const refreshToken = this.createRefreshToken(userId);
    await this.userRepository.saveRefreshToken(userId, refreshToken);

    return { userId, profileImg, nickname, accessToken, refreshToken };
  }

  async logout(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new ForbiddenException('user_mismatch');
    }

    await this.userRepository.removeRefreshToken(tokenUserId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.utilsService.compare(password, user.password);
    if (!isMatchPassword) {
      return false;
    }

    return true;
  }

  async verify(verifyToken: string) {
    await this.userRepository.verify(verifyToken);
  }

  async check(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new ForbiddenException('user_mismatch');
    }

    const user = await this.userRepository.findById(userId);
    if (!user.refreshToken) {
      throw new UnauthorizedException('not_logged_in');
    }
  }

  generateAccessToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken);
    const userId = decodedToken['userId'];

    return this.createAccessToken(userId);
  }

  createAccessToken = (userId: string): string => {
    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn = this.configService.get<string>('jwt.atkExpiresIn');

    return this.jwtService.sign({ userId }, { secret, expiresIn });
  };

  createRefreshToken = (userId: string): string => {
    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn = this.configService.get<string>('jwt.rtkExpiresIn');

    return this.jwtService.sign({ userId }, { secret, expiresIn });
  };
}
