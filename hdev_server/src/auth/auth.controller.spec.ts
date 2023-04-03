import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { UtilsService } from 'src/utils/utils.service';
import { ConfigService } from '@nestjs/config';

/**
 * 인증 관련 컨트롤러 테스트코드
 */
describe('[Controller] AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        EmailService,
        UtilsService,
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
    it('authService.register가 호출되었는지 확인', async () => {
      /**
       * -- given
       * 회원가입시 사용되는 request.body.registerDto 생성
       */
      const registerData = new RegisterDto();
      registerData.email = 'test@test.com';
      registerData.password = 'asdf1234!@';
      registerData.nickname = 'testuser';

      /**
       * -- when
       */
      const spyRegister = jest.spyOn(authService, 'register');
      await authController.register(registerData);

      /**
       * -- then
       * authService.register 메소드가 registerDto로 호출되었는지 확인
       */
      expect(spyRegister).toHaveBeenCalledWith(registerData);
    });
  });

  describe('[로그인] AuthController.login()', () => {
    it('authService.login이 호출되고 데이터가 반환되었는지 확인', async () => {
      /**
       * -- given
       * 1. 로그인시 사용되는 request.body.loginDto 생성
       * 2. express.response 모킹
       */
      const loginData = new LoginDto();
      loginData.email = 'test@test.com';
      loginData.password = 'asdf1234!@';

      const response = { cookie: jest.fn() } as unknown as Response;

      /**
       * -- when
       * 1. authService.login은 서비스로직 처리후 아래 데이터 반환
       */
      jest.spyOn(authService, 'login').mockResolvedValue({
        userId: 'userId',
        profileImg: 'profileImg',
        nickname: 'nickname',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await authController.login(response, loginData);

      /**
       * -- then
       * 1. login 메소드의 반환값에 아래 데이터가 있는지 확인
       * 2. response.cookie가 refresh 토큰으로 호출되었는지 확인
       */
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('profileImg');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('accessToken');
      expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'refreshToken', {
        httpOnly: true,
        path: '/',
      });
    });
  });

  describe('[로그아웃] AuthController.logout()', () => {
    it('authService.logout이 호출되었는지 확인', () => {
      // given
      const req = { user: { userId: 'userId' } };
      const userId = 'userId';

      // then
      const spyLogout = jest.spyOn(authService, 'logout');

      // then
      expect(spyLogout).toBeCalledWith(req, userId);
    });
  });

  describe('[토큰재발급] AuthController.token()', () => {
    it('authService.createAccessToken을 호출하고 accessToken이 반환되는지 확인', async () => {
      // given
      const req = {
        cookies: {
          refreshToken: 'refreshToken',
        },
      };

      // when
      jest.spyOn(authService, 'createAccessToken').mockResolvedValue('accessToken' as never);
      const result = await authController.token(req);

      // then
      expect(result).toHaveProperty('accessToken');
    });
  });
});
