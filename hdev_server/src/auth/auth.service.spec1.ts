import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto } from './dto/login.dto';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { EmailService } from 'src/email/email.service';

describe('[Service] AuthService', () => {
  let authService: AuthService;
  let utilsService: UtilsService;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  const email = 'test@test.com';
  const password = 'asdf1234!@';
  const nickname = 'testuser';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
            sign: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            getUUID: jest.fn(),
            encrypt: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: UserRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserByNickname: jest.fn(),
            register: jest.fn(),
            saveRefreshToken: jest.fn(),
            removeRefreshToken: jest.fn(),
            verify: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('[회원가입] AuthService.register()', () => {
    it('기존에 존재하는 이메일이면 400 반환, exist_email', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.email = email;
      user.password = password;
      user.nickname = nickname;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(null);

      try {
        await authService.register(registerDto);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('exist_email');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('기존에 존재하는 닉네임이면 400 반환, exist_nickname', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.email = email;
      user.password = password;
      user.nickname = nickname;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(user);

      try {
        await authService.register(registerDto);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('exist_nickname');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('기존에 존재하지 않는 이메일, 닉네임이면 userRepositry.register 호출 확인', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.userId = 'userId';
      user.email = email;
      user.password = 'encryptPassword';
      user.nickname = nickname;
      user.verifyToken = 'verifyToken';

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(null);
      jest.spyOn(utilsService, 'getUUID').mockReturnValue('verifyToken');
      jest.spyOn(utilsService, 'encrypt').mockResolvedValue('encryptPassword');
      jest.spyOn(userRepository, 'register').mockResolvedValue(user);
      const result = await authService.register(registerDto);

      // then
      expect(result).toBe('userId');
    });
  });

  describe('[로그인] AuthService.login()', () => {
    it('로그인은 성공이나 인증되지 않은 유저면 401 반환', async () => {
      // given
      const loginDto: LoginDto = { email, password };
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      try {
        await authService.login(loginDto);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('unauthorized_user');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('로그인 성공 및 인증된 유저면 데이터 반환', async () => {
      // given
      const loginDto: LoginDto = { email, password };
      const user = new User();
      user.userId = 'userId';
      user.isVerified = true;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(authService, 'createAccessToken').mockReturnValue('accessToken');
      jest.spyOn(authService, 'createRefreshToken').mockReturnValue('refreshToken');
      const spySaveRtk = jest.spyOn(userRepository, 'saveRefreshToken');
      const result = await authService.login(loginDto);

      // then
      expect(spySaveRtk).toBeCalledWith(user.userId, 'refreshToken');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('profileImg');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('[로그아웃] AuthService.logout()', () => {
    it('토큰에 포함된 유저아이디와 실제 요청한 유저의 아이디가 다를경우 unautorized 에러 발생', async () => {
      // given
      const tokenUserId = 'userId1';
      const userId = 'userId2';

      // when
      try {
        const result = await authService.logout(tokenUserId, userId);
      } catch (err: any) {
        expect(err.message).toEqual('unauthorized_user');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('아이디가 일치하는경우 removeRefreshToken 호출', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';

      // when
      const spyRemoveRefreshToken = jest.spyOn(userRepository, 'removeRefreshToken');
      await authService.logout(tokenUserId, userId);

      // then
      expect(spyRemoveRefreshToken).toBeCalledWith(tokenUserId);
    });
  });

  describe('[유저검증] AuthService.validateUser()', () => {
    it('이메일을 사용하는 유저가 없을경우 false 반환', async () => {
      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(false);
    });

    it('유저는 있으나 비밀번호가 틀릴경우 false 반환', async () => {
      // given
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(false);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(false);
    });

    it('유저 검증에 성공할 경우 true', async () => {
      // given
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(true);
    });
  });

  describe('[이메일인증] AuthService.verify()', () => {
    it('이메일인증 요청시 userRepository.verify 호출', async () => {
      // given
      const verifyToken = 'verifyToken';

      // when
      const spyVerify = jest.spyOn(userRepository, 'verify');
      await authService.verify(verifyToken);

      // then
      expect(spyVerify).toBeCalledWith(verifyToken);
    });
  });

  describe('[엑세스토큰 재발급] AuthService.generateAccessToken()', () => {
    it('재발급 성공', async () => {
      // given
      const refreshToken = 'refreshToken';

      // when
      jest.spyOn(jwtService, 'decode').mockReturnValue({ userId: 'userId' });
      jest.spyOn(authService, 'createAccessToken').mockReturnValue('accessToken');
      const result = authService.generateAccessToken(refreshToken);

      // then
      expect(result).toEqual('accessToken');
    });
  });

  describe('[로그인여부 체크] AuthService.check()', () => {
    it('토큰에있는 유저의 아이디와 실제 요청한 유저의 아이디가 다르면 unauthorized 에러반환', async () => {
      // given
      const tokenUserId = 'userId1';
      const userId = 'userId2';

      // when
      try {
        await authService.check(tokenUserId, userId);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('user_mismatch');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('refreshToken이 없을경우 not_logged_in 에러 반환', async () => {
      // given
      const tokenUserId = 'userId1';
      const userId = 'userId1';
      const user = new User();
      user.refreshToken = '';

      // when
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      try {
        await authService.check(tokenUserId, userId);
      } catch (err: any) {
        expect(err.message).toEqual('not_logged_in');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('[엑세스토큰 생성] AuthService.createAccessToken()', () => {
    it('정상적인 토큰 생성', () => {
      // given
      const userId = 'userId';

      // when
      jest.spyOn(jwtService, 'sign').mockReturnValue('accessToken');
      const result = authService.createAccessToken(userId);

      // then
      expect(result).toBe('accessToken');
    });
  });

  describe('[리프레쉬토큰 생성] AuthService.createRefreshToken()', () => {
    it('정상적인 토큰 생성', () => {
      // given
      const userId = 'userId';

      // when
      jest.spyOn(jwtService, 'sign').mockReturnValue('refreshToken');
      const result = authService.createRefreshToken(userId);

      // then
      expect(result).toBe('refreshToken');
    });
  });
});
