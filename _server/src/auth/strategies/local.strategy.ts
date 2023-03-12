import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    /**
     * Local 전략의 경우 기본값은 username이다.
     * 만약 @Body에 email 필드가 없다면 unauthorized 에러가 발생하므로 필드명을 커스텀해줘야 한다.
     */
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    /**
     * 서비스에서 구현한 validateUser 메소드로 이메일, 비밀번호를 사용하여 유저를 검증해준다.
     */
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('invalid_email_or_password');
    }

    return user;
  }
}
