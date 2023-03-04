import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { v4 } from 'uuid';
import { PasswordService } from 'src/password/password.service';
import { EmailService } from 'src/email/email.service';
import { CustomException } from 'src/exceptions/custom.exception';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * 회원가입 서비스 로직
   * @param registerDto - 회원가입 데이터
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    /** 이메일로 유저 검색해서 존재하는 이메일이면 에러 반환*/
    const userByEmail = await this.usersRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Email is already in use',
        email,
        'exist_email',
      );
    }

    /** 닉네임으로 유저 검색해서 존재하는 닉네임이면 에러 반환*/
    const userByNickname = await this.usersRepository.findUserByNickname(
      nickname,
    );

    if (userByNickname) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Nickname is already in use',
        nickname,
        'exist_nickname',
      );
    }

    /** 이메일 인증용 토큰 생성 */
    const verifyToken = v4();

    const user = new UserEntity();
    user.email = email;
    user.password = await this.passwordService.encryptPassword(password);
    user.nickname = nickname;
    user.verifyToken = verifyToken;
    await this.usersRepository.createUser(user);

    /** 인증용 이메일 발송 */
    // await this.emailService.sendVerifyUserEmail(email, verifyToken);
  }

  /**
   * 로그인 서비스 로직
   * @param loginDto - 로그인 데이터
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findUserByEmail(email);

    /** 유저가 없는 경우 */
    if (!user) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Email is do not exist or Password is invalid',
        '',
        'invalid_email_or_password',
      );
    }

    /** 비밀번호가 일치하지 않는 경우 */
    if (
      !(await this.passwordService.comparePassword(password, user.password))
    ) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Email is do not exist or Password is invalid',
        '',
        'invalid_email_or_password',
      );
    }

    const { userId, profileImg, nickname } = user;
    const accessToken = this.jwtService.sign(
      { userId, profileImg, nickname },
      {
        secret: 'asf18h9asdjsa',
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: 'asf18h9asdjsa',
        expiresIn: '15m',
      },
    );

    return { userId, profileImg, nickname, accessToken, refreshToken };
  }
}
