import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// TODO: jwtket 변경필욘
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hello',
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
