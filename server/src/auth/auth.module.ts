import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/user/user.entity';
import { PasswordModule } from '../password/password.module';
import { EmailModule } from '../email/email.module';
import { UserRepository } from '../users/user/user.repository';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './jwt-constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PasswordModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
