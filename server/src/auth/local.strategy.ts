import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomException } from 'src/exceptions/custom.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // username 대신 email로 인증처리
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        'Email is do not exist or Password is invalid',
        'email or password',
        'invalid_email_or_password',
      );
    }

    return user;
  }
}
