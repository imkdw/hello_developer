import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { v4 } from 'uuid';
import { PasswordService } from 'src/password/password.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    const existUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (existUser) {
      if (existUser.nickname === nickname) {
        // TODO: 중복된 닉네임 에러 반환
        throw new BadRequestException({
          description: 'Email is already in use',
          data: {
            action: 'register',
            parameter: email,
            message: 'exist_email',
          },
        });
      }

      // TODO: 중복된 이메일 에러 반환
    }

    const verifyToken = v4();

    const user = new UserEntity();
    user.email = email;
    user.password = await this.passwordService.encryptPassword(password);
    user.nickname = nickname;
    user.verifyToken = verifyToken;
    await this.usersRepository.save(user);

    // 등록된 이메일로 인증링크 발송 필요
    // await this.emailService.sendVerifyUserEmail(email, verifyToken);
  }
}
