import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO: 환경변수 처리하기
      secretOrKey: 'jwtSecret12345!@@!',
    });
  }

  async validate(payload: any) {
    const userId = payload.userId;

    if (!userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    return { userId };
  }
}
