import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { UtilsModule } from '../utils/utils.module';

// TODO: JwtKey 변경필ㄹ요
@Module({
  imports: [
    UsersModule,
    UtilsModule,
    JwtModule.register({
      secret: 'hello',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
