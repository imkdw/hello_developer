import { Test, TestingModule } from '@nestjs/testing';
import { PasswordModule } from 'src/password/password.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthValidationPipe } from './pipes/validation.pipe';

describe('[컨트롤러] AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PasswordModule],
      controllers: [AuthController],
      providers: [AuthService, AuthValidationPipe],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('정상적인 계정으로 회원가입, 반환값없음', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password!!!',
        nickname: 'testuser',
      };

      const result = await controller.register(registerDto);
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return the login DTO', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password!!!',
      };

      const result = await controller.login(loginDto);
      expect(result).toEqual(loginDto);
    });
  });
});
