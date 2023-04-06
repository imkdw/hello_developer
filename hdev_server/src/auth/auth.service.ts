import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

  /**
   * 회원가입을 처리하는 로직
   * @param registerDto - 회원가입에 사용되는 데이터
   * @returns - 사용자 아이디 반환
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    /** 이메일, 닉네임으로 유저 검색해서 중복된게 있는지 확인 */
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
   * 로그인을 처리하는 로직, 실제 유저인증은 가드에서 처리함
   * @param loginDto - 로그인에 사용되는 데이터
   * @returns accessToken등 데이터 반환
   */
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

  /**
   * 로그아웃을 처리하는 로직
   * @param tokenUserId - jwt 토큰에 저장된 유저의 아이디
   * @param userId - 실제 http 요청에 포함된 유저아이디 파라미터
   */
  async logout(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.removeRefreshToken(tokenUserId);
  }

  /**
   * LocalAuthGuard에서 사용하는 사용자 검증 로직
   * @param email - 입력받은 이메일
   * @param password - 입력받은 비밀번호
   * @returns 검증여부 반환
   */
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return false;

    const isMatchPassword = await this.utilsService.compare(password, user.password);
    if (!isMatchPassword) return false;

    return true;
  }

  /**
   * refreshToken을 활용한 accessToken 재발급에 사용되는 로직
   * @param refreshToken req.cookie에 포함된 refreshToken
   * @returns accessToken 반환
   */
  generateAccessToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken);
    const userId = decodedToken['userId'];

    return this.createAccessToken(userId);
  }

  /**
   * 회원가입시 이메일인증에서 사용되는 verifyToken을 활용한 인증여부 업데이트 로직
   * @param verifyToken - 회원가입시 발급되는 토큰
   */
  async verify(verifyToken: string) {
    await this.userRepository.verify(verifyToken);
  }

  /**
   * 클라이언트에 정보가 저장된 유저가 로그인된 유저인지 확인하는 로직
   * @param tokenUserId - atk에 저장된 유저의 아이디
   * @param userId - 실제 요청 유저의 아이디
   * @returns 문제가 있는경우에만 에러 반환
   */
  async check(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new BadRequestException('user_mismatch');
    }

    const user = await this.userRepository.findById(userId);
    if (!user.refreshToken) {
      throw new UnauthorizedException('not_logged_in');
    }
  }

  /** 엑세스토큰 발급 */
  createAccessToken = (userId: string): string => {
    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn = this.configService.get<string>('jwt.atkExpiresIn');

    return this.jwtService.sign({ userId }, { secret, expiresIn });
  };

  /** 리프레쉬토큰 발급 */
  createRefreshToken = (userId: string): string => {
    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn = this.configService.get<string>('jwt.rtkExpiresIn');

    return this.jwtService.sign({ userId }, { secret, expiresIn });
  };
}
