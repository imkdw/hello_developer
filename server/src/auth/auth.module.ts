import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { PasswordModule } from 'src/password/password.module';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from 'src/repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PasswordModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
