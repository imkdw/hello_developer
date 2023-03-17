import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UsersModule, UtilsModule, ConfigModule, EmailModule],
  providers: [AuthService, LocalStrategy, JwtService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
