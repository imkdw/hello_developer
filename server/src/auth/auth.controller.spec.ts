import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/password/password.service';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/user/users.repository';

describe('AuthController', () => {
  let passwordService: PasswordService;
  let emailService: EmailService;
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    // private readonly usersRepository: UsersRepository,
    authService = new AuthService(passwordService, emailService, jwtService, userRepository);
  });
});
