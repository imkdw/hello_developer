import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { UsersService } from 'src/users/users.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('[Controller] AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule, UtilsModule, ConfigModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('[회원가입] AuthController.register()', () => {
    it('입력값 검증이후 authService.register가 호출되었는지 확인', async () => {
      // given
      const registerData = new RegisterDto();
      registerData.email = 'test@test.com';
      registerData.password = 'asdf1234!@';
      registerData.nickname = 'testuser';

      // when
      jest.spyOn(authService, 'register').mockResolvedValue(undefined);
      await authController.register(registerData);

      // then
      expect(authService.register).toHaveBeenCalledWith(registerData);
    });
  });

  describe('[로그인] AuthController.login()', () => {
    it('입력값 검증이후 authService.login이 호출되고 토큰 등이 반환되었는지 확인', async () => {
      // given
      const loginData = new LoginDto();
      loginData.email = 'test@test.com';
      loginData.password = 'asdf1234!@';

      // when
      jest.spyOn(authService, 'login').mockResolvedValue({
        userId: 'userId',
        profileImg: 'profileImg',
        nickname: 'nickname',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      const result = await authController.login(loginData);

      // then
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('profileImg');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });
  });
});
