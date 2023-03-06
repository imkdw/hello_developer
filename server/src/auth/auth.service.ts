import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { v4 } from 'uuid';
import { PasswordService } from 'src/password/password.service';
import { EmailService } from 'src/email/email.service';
import { CustomException } from 'src/exceptions/custom.exception';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/user/users.repository';
import { UserEntity } from 'src/users/user/user.entity';
import { jwtConstants } from './jwt-constants';

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
      throw new CustomException(HttpStatus.BAD_REQUEST, 'Email is already in use', email, 'exist_email');
    }

    /** 닉네임으로 유저 검색해서 존재하는 닉네임이면 에러 반환*/
    const userByNickname = await this.usersRepository.findUserByNickname(nickname);

    if (userByNickname) {
      throw new CustomException(HttpStatus.BAD_REQUEST, 'Nickname is already in use', nickname, 'exist_nickname');
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
    const user = await this.usersRepository.findUserByEmail(loginDto.email);
    const { userId, profileImg, nickname } = user;

    return {
      accessToken: this.jwtService.sign({ userId }),
      profileImg,
      nickname,
    };
  }

  /**
   * 로그인 시 유저 검증 로직
   * @param loginDto - 로그인할때 전달받은 데이터
   * @returns {Promise<false | UserEntity>} - 검증불가 또는 유저정보 반환
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findUserByEmail(username);
    if (user && this.passwordService.comparePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
