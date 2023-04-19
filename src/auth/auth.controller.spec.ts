import { JwtService } from '@nestjs/jwt';
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

/**
 * 인증 관련 컨트롤러 테스트코드
 */
describe('[Controller] AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            validateUser: jest.fn(),
            generateAccessToken: jest.fn(),
            verify: jest.fn(),
            check: jest.fn(),
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('[회원가입] AuthController.register()', () => {
    it('authService.register가 호출되었는지 확인', async () => {
      // given
      const registerData = new RegisterDto();
      registerData.email = 'test@test.com';
      registerData.password = 'asdf1234!@';
      registerData.nickname = 'testuser';

      // when
      jest.spyOn(authService, 'register').mockResolvedValue('userId');
      const result = await authController.register(registerData);

      // then
      expect(result).toEqual({ userId: 'userId' });
    });
  });

  describe('[로그인] AuthController.login()', () => {
    it('authService.login이 호출되고 데이터반환 및 쿠키가 설정되었는지 확인', async () => {
      // given
      const loginData = new LoginDto();
      loginData.email = 'test@test.com';
      loginData.password = 'asdf1234!@';

      const response = { cookie: jest.fn() } as unknown as Response;

      // when
      jest.spyOn(authService, 'login').mockResolvedValue({
        userId: 'userId',
        profileImg: 'profileImg',
        nickname: 'nickname',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await authController.login(response, loginData);

      // then
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('profileImg');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('accessToken');
      expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'refreshToken', {
        httpOnly: true,
        path: '/',
        secure: true,
      });
    });
  });

  describe('[로그아웃] AuthController.logout()', () => {
    it('authService.logout이 호출되었는지 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const userId = 'userId';

      // then
      await authController.logout(req, userId);

      // then
      expect(authService.logout).toBeCalledWith(req.user.userId, userId);
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
      jest.spyOn(authService, 'createAccessToken').mockReturnValue('accessToken');
      jest.spyOn(jwtService, 'decode').mockReturnValue({ userId: 'userId' });
      const result = await authController.token(req);

      // then
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('[이메일인증 토큰검증] AuthController.verify()', () => {
    it('authService.verify를 호출하는지 확인', async () => {
      // given
      const verifyToken = 'verifyToken';

      // when
      const spyVerify = jest.spyOn(authService, 'verify');
      await authController.verify(verifyToken);

      // then
      expect(spyVerify).toBeCalledWith(verifyToken);
    });
  });

  describe('[로그인여부 검증] AuthController.check()', () => {
    it('authService.check가 호출되는지 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const userId = 'userId';
      const user = new User();
      user.refreshToken = 'refreshToken';

      // when
      const spyCheck = jest.spyOn(authService, 'check').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      await authController.check(req, userId);

      // then
      expect(spyCheck).toBeCalledWith(req.user.userId, userId);
    });
  });
});
